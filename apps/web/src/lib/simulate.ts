import { groupBy } from 'lodash';
import { getProposals, getProposalVotes, getUsers, type SnapshotUser } from './gql/snapshot';
import { truncateAddress } from './helpers/truncate-address';

/**
 * Calculate the influence of a users in a space based on past proposals.
 * @param spaceId - The Snapshot.org space ID to get the proposals for.
 */
export async function simulate(spaceId: string) {
	const result = await getProposals(spaceId);
	const proposals = Object.fromEntries(result.proposals.map((proposal) => [proposal.id, proposal]));
	const voterVotes = await Promise.all(
		result.proposals.map(async (proposal) => {
			const votes = await getProposalVotes(proposal.id);
			return votes.votes.map((vote) => ({ ...vote, proposalId: proposal.id }));
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

	const voters = Object.entries(voterVotes).map(
		([voter, votes]): Voter => ({
			address: voter,
			name: snapshotUsers[voter]?.name ?? truncateAddress(voter),
			avatar: snapshotUsers[voter]?.avatar ?? null,
			influence: votes.length,
			power: 1
		})
	);

	return {
		proposals,
		voterVotes,
		voters
	};
}
