root = exports ? this

root.gs = new GrooveShark '67b088cec7b78a5b29a42a7124928c87'

root.lastfm = new LastFM
	apiKey: '6e9f1f13f07ba5bcbfb0a8951811c80e'
	apiSecret: '4db7199ede1a06b27e6fd96705ddba49'

root.lastfm.error =
	notFound: 404
	invalidService: 2
	invalidMethod: 2
	authenticationFailed: 4
	invalidFormat: 5
	invalidParameters: 6
	invalidResource: 7
	operationFailed: 8
	invalidSessionKey: 9
	invalidAPIKey: 10
	serviceOffline: 11
	invalidMethodSignature: 13
	serverError: 16
	suspendedKey: 26
	rateLimitExceeded: 29


class root.TrackFinder
	@defaultLimit: 5
	limit: null
		
	constructor: (limit) ->
		this.limit = limit ? TrackFinder.defaultLimit

	findById: (mbid, callback) =>
		lastfm.track.getSimilar
			mbid: mbid
			limit: this.limit
		,
			success: (data) =>
				callback?(this.parseResult(data))
			error: (code, message) ->
				callback?( 
					error: code
					message: message
				)

	find: (title, artist, callback) =>
		lastfm.track.getSimilar
			track: title
			artist: artist
			autocorrect: 1
			limit: this.limit
		,
			success: (data) =>
				callback?(this.parseResult(data))
			error: (code, message) ->
				callback?( 
					error: code
					message: message
				)

	parseResult: (data) ->
		if not ('@attr' of data.similartracks)
			return {
				error: lastfm.error.notFound
				message: 'Song not found'
			}

		return data.similartracks





		
