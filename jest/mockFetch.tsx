// // add this to your setupFilesAfterEnv config in jest so it's imported for every test file
// import * as actions from './actions/oauthActions';
// async function mockFetch(url, config) {
//   switch (url) {
//     case '/oauth/token': {
//       const user = await actions.login(JSON.parse(config.body))
//       return {
//         ok: true,
//         status: 200,
//         json: async () => ({access_token}),
//       }
//     }
//     case '/user/access_token=...': {
//       const user = await actions.login(JSON.parse(config.body))
//       return {
//         ok: true,
//         status: 200,
//           json: async () => ({user}),
//         })
//       }
//     case '/user/access_token=...': {
//       const user = await actions.login(JSON.parse(config.body))
//       return {
//         ok: true,
//         status: 200,
//           json: async () => ({user}),
//         })
//       }
//       const shoppingCart = JSON.parse(config.body)
//       // do whatever other things you need to do with this shopping cart
//       return {
//         ok: true,
//         status: 200,
//         json: async () => ({success: true}),
//       }
//     }
//     default: {
//       throw new Error(`Unhandled request: ${url}`)
//     }
//   }
// }
// beforeAll(() => jest.spyOn(global, 'fetch'))
// beforeEach(() => global.fetch.mockImplementation(mockFetch))
