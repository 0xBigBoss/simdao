const voters = [{}];

import { request, gql } from 'graphql-request';

(async () => {
	const query = gql`
		query {
			proposal(id: "0xf4d2d4c89e29cd11472d5b86f013cb0995952b96099ced35eb91a03e99fbb5cf") {
				id
				title
				body
				choices
				start
				end
				snapshot
				state
				author
				created
				scores
				scores_by_strategy
				scores_total
				scores_updated
				plugins
				network
				strategies {
					name
					network
					params
				}
				space {
					id
					name
				}
			}
		}
	`;

	await request('https://hub.snapshot.org/graphql', query).then((data) => console.log(data));
})();
