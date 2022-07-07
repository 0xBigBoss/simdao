import { getProposals, getProposalVotes, getUsers, type SnapshotUser } from '$lib/gql/snapshot';
import { groupBy } from 'lodash';
// import snapshot from '@snapshot-labs/snapshot.js';
// import { ENS } from '@ensdomains/ensjs';
// import { AvatarResolver } from '@ensdomains/ens-avatar';

import type { RequestHandler } from './__types';

export const get: RequestHandler = async ({ params }) => {
	return {
		body: {}
	};
};
