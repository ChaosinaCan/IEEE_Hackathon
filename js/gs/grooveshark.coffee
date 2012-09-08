root = exports ? this

class root.GrooveShark
	@endpoint = 'api/query-song.php'

	key = null

	constructor: (apikey) ->
		key = apikey

	query: (query, callback, errback) ->
		url = encodeURI(GrooveShark.endpoint + "?query=#{query}")
		#console.log url
		$.getJSON(url).then callback, errback

	search: (title, artist, callback, errback) =>
		this.query "#{artist} #{title}", callback, errback
		