const { createLogger } = require('../util/logger')
const logger = createLogger('accessTokenDecoder')
import { decryptJsonWebToken, IJsonWebToken } from '../util/cloudguard_utils'


const tokenExtractor = async (request, response, next) => {
	const authorization = request.get('authorization')

	// by default, no access
	request.access = {
		system: null,
		ecrVendor: null,
		merchant: null
	}

	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

		const token = authorization.substring(7)

		try {
			const decrypted = await decryptJsonWebToken(token)

			const access = Object.assign({},
				decrypted.merchant ? { merchant: decrypted.merchant } : null,
				decrypted.ecrVendor ? { ecrVendor: decrypted.ecrVendor } : null,
				decrypted.system ? { system: decrypted.system } : null
			)

			request.access = access

		} catch (err) {
			logger.verbose(`JsonWebToken auth error: ${err}`)
			next(err)
		}

	}

	next()
}

export default tokenExtractor