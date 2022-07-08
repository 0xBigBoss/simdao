import { groupBy } from 'lodash';
import {
	getProposals,
	getProposalVotes,
	getSpace,
	getUsers,
	type SnapshotUser,
	type Voter
} from './gql/snapshot';
import { truncateAddress } from './helpers/truncate-address';
import snapshot from '@snapshot-labs/snapshot.js';

/**
 * Calculate the influence of a users in a space based on past proposals.
 * @param spaceId - The Snapshot.org space ID to get the proposals for.
 */
export async function simulate(spaceId: string) {
	const { space } = await getSpace(spaceId);
	if (!space) {
		throw new Error(`Space ${spaceId} not found.`);
	}

	const result = await getProposals(spaceId);
	const proposals = Object.fromEntries(result.proposals.map((proposal) => [proposal.id, proposal]));
	const voterVotes = await Promise.all(
		result.proposals.map(async (proposal) => {
			const votes = await getProposalVotes(proposal.id);
			// assign the voter scores to the proposal
			const [snapShotScores] = await snapshot.utils.getScores(
				spaceId,
				space.strategies,
				space.network,
				votes.votes.map((v) => v.voter),
				proposal.snapshot
			);
			const scores = Object.fromEntries(
				Object.entries(snapShotScores).map(([voter, score]) => [voter.toLowerCase(), score])
			);

			return votes.votes.map((vote) => ({
				...vote,
				voter: vote.voter.toLowerCase(),
				influence: scores[vote.voter.toLowerCase()] ?? 0,
				proposalId: proposal.id
			}));
		})
	)
		.then((votes) => votes.flat())
		.then((votes) => {
			return groupBy(votes, (vote) => vote.voter.toLowerCase());
		});

	const snapshotUsers = (await getUsers(Object.keys(voterVotes))).users.reduce(
		(acc: Record<string, SnapshotUser>, user) => {
			acc[user.id.toLowerCase()] = user;
			return acc;
		},
		{}
	);

	// const provider = await snapshot.utils.getProvider('1', 'brovider');
	// const ENSInstance = new ENS();
	// await ENSInstance.setProvider(provider);
	// const avatarResolver = new AvatarResolver(provider);
	// const ensRecords = await Promise.all(
	// 	Object.keys(voterVotes).map(async (voter) => {
	// 		const ens = (await ENSInstance.getName(voter))?.name ?? null;
	// 		const avatar = ens ? await avatarResolver.getAvatar(ens, {}) : null;
	// 		return {
	// 			voter,
	// 			ens,
	// 			avatar: avatar
	// 		};
	// 	})
	// ).then((records) => {
	// 	return records.reduce((acc: Record<string, any>, record) => {
	// 		acc[record.voter] = record;
	// 		return acc;
	// 	}, {});
	// });
	// get voting scores at latest block

	const [snapShotScores] = await snapshot.utils.getScores(
		spaceId,
		space.strategies,
		space.network,
		Object.keys(voterVotes)
	);
	const scores = Object.fromEntries(
		Object.entries(snapShotScores).map(([voter, score]) => [voter.toLowerCase(), score])
	);
	const voters = Object.entries(voterVotes)
		.map(
			([voter, votes]): Voter => ({
				address: voter,
				name: snapshotUsers[voter]?.name ?? truncateAddress(voter),
				avatar: snapshotUsers[voter]?.avatar ?? null,
				influence: votes.reduce((acc, vote) => acc + vote.influence, 0),
				power: scores[voter] ?? 0
			})
		)
		.filter((voter) => voter.power > 0);

	return {
		proposals,
		voterVotes,
		voters
	};
}
