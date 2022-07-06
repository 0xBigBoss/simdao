import { request, gql } from 'graphql-request';

export type Proposal = {
	id: string;
	title: string;
	start: number;
	end: number;
	snapshot: string;
	state: string;
};

export type Vote = {
	id: string;
	voter: string;
	created: number;
	choice: string;
};

export type Voter = {
	address: string;
	name: Promise<string>;
	avatar: Promise<string>;
	influence: number;
	power: number;
};

export type Choice = {
	name: string;
	voters: Voter[];
};

export type SnapshotUser = {
	id: string;
	name: string;
	about: string;
	avatar: string;
};

export const getSpace = async (id: string) => {
	const query = gql`
		query getSpace($id: String!) {
			space(id: $id) {
				id
				name
				about
				network
				symbol
				strategies {
					name
					network
					params
				}
				admins
				members
				filters {
					minScore
					onlyMembers
				}
				plugins
			}
		}
	`;

	return await request('https://hub.snapshot.org/graphql', query, { id });
};

export const getProposals = async (spaceId: string): Promise<{ proposals: Proposal[] }> => {
	const query = gql`
		query Proposals($spaceId: String!) {
			proposals(
				first: 100
				skip: 0
				where: { space_in: [$spaceId] }
				orderBy: "created"
				orderDirection: desc
			) {
				id
				title
				# body
				choices
				start
				end
				snapshot
				state
			}
		}
	`;
	return await request('https://hub.snapshot.org/graphql', query, { spaceId });
};

export const getProposalVotes = async (proposalId: string): Promise<{ votes: Vote[] }> => {
	const query = gql`
		query Votes($proposalId: String!) {
			votes(first: 1000, where: { proposal: $proposalId }) {
				id
				voter
				created
				choice
			}
		}
	`;
	return await request('https://hub.snapshot.org/graphql', query, { proposalId });
};

export const getUsers = async (userIds: string[]): Promise<{ users: SnapshotUser[] }> => {
	const query = gql`
		query Users($userIds: [String!]!) {
			users(where: { id_in: $userIds }) {
				id
				name
				about
				avatar
			}
		}
	`;
	return await request('https://hub.snapshot.org/graphql', query, { userIds });
};
