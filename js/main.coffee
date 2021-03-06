# Use Iced CoffeeScript

root = exports ? this

root.gs = new GrooveShark '67b088cec7b78a5b29a42a7124928c87'
#gs.open()

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

root.lastfm.search = (title, artist, callback) ->
	query = 
		track: title
		limit: 10
	if artist? and artist != ''
		query.artist = artist

	lastfm.track.search query, 
		success: (data) ->
			if typeof data.results.trackmatches == 'object'
				tempresults = (SongData.fromLastFM(track) for track in data.results.trackmatches.track)
			else
				tempresults = []
			results = []
			for track, i in tempresults
				await track.checkGrooveShark defer results[i]

			callback?(results)
			
		error: (code, message) ->
			console.log(code, message)
			callback?([])



class root.TrackFinder
	@defaultLimit: 6
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


		
beginTree = (songdata) ->
	rootlist = $('<ul>')
	$('#tree').empty().append(rootlist)

	doExpand = (node, li) -> 
		if node._clicked?
			return
		
		node._clicked = true
		li.addClass('working')

		node.expand (expanded) ->
			li.removeClass('working')
			if expanded.children.length == 0
				$(li).children('ul').append($('<li>').text('No similar songs found'))
			for child in expanded.children
				insertSongNode(child, $(li).children('ul'))
		

	# I have no idea what this does any more
	insertSongNode = (node, list) ->
		item = $('<li>')
		item.append(
			$('<a href="javascript:;">').text("#{node.song.title} � #{node.song.artist}")
				.attr('title', node.song.mbid)
				.click( -> 
					$(this).removeAttr('href')
					doExpand(node, item)
				)
		)
		if node.song.gs.url?
			item.append(
				$('<a class=play>')
					.attr('href', node.song.gs.url)
					.click( (e) -> 
						gs.changeSong(node.song.gs.url)
						e.preventDefault()
					)
			)
		item.append($('<ul>'))
		list.append(item)
		return item

	root.rootnode = new SongNode(songdata)
	insertSongNode(rootnode, rootlist)

	doExpand(rootnode, rootlist.children('li'))



$ ->
	selectResult = (track) ->
		beginTree(track)
		$('#search-results').empty()
	
	$('#search-submit').click (e)->
		e.preventDefault()
		$(this).attr('disabled', true)
		$('#search-form').addClass('working')
		
		results = []
		await lastfm.search $('#search-song').val(), $('#search-artist').val(), defer results

		container = $('#search-results').empty()
		if results.length == 0
			container.append($('<p>').text('No songs found'))
		else
			list = $('<ul>')
			for track in results
				do (track) ->
					list.append(
						$('<li>').append(
							$('<a href="javascript:;">').text("#{track.title} � #{track.artist}")
								.click( -> selectResult(track))
						)
					)

			container.append(list)

		$(this).removeAttr('disabled')
		$('#search-form').removeClass('working')

				
