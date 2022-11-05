var fadeOut = 0;
var fadeIn = 0;
var randomWho = {
	regeneration: {
		...window.rwSettings.regeneration,
	},
	xmas: false,
	audio: window.AudioContext || window.webkitAudioContext || null,
	type: 'webaudio',
	generated: false,
	firstRun: true,
	muted: false,
	init: function () {
		//check for either blob or webaudio or
		//blob > webaudio

		//Auto XMAS
		var date = new Date();

		if (date.getMonth() == 11 && date.getDate() >= 22 && date.getDate() <= 25) {
			this.xmas = true;
		}
		document.querySelector('.generator').addEventListener('click', () => {
			this.generate();
		});
		document.querySelector('.regenerator').addEventListener('click', () => this.generate());

		var audio_context = this.audio;

		if (audio_context != null) {
			var theme = window.rwSettings.currentTheme + '.txt';
			if (this.xmas) theme = 's05xmas01.txt';
			if (this.regeneration.active) theme = this.regeneration.theme + '.txt';

			this.load(theme);
		}

		if (this.xmas == true) document.querySelector('video').src = 'video/bg_xmas.mov';

		document.querySelector('#mute').onchange = function () {
			if (!this.muted) {
				this.mainVolume.gain.value = 0;
				this.muted = true;
				//document.querySelector('.mute').classList.add('muted')
			} else {
				this.mainVolume.gain.value = 1;
				this.muted = false;
				//document.querySelector('.mute').classList.remove('muted')
			}
		};

		if (this.xmas == true) {
			document.querySelector('body').classList.add('xmas');
			document.querySelector('.logo img').src = 'images/xmas/logo.png';
			document.querySelector('.message h4').innerHTML = this.regeneration.content;
		}

		if (this.regeneration.active) {
			document.querySelector('body').classList.add('regenaration');
			document.querySelector('.logo img').src = 'images/r/logo.png';
			document.querySelector('.message h4').innerHTML = this.regeneration.content;
		}

		/*
        if(window.location.hash){
            var hash = window.location.hash;
            hash = hash.split("e");
            hash[0] = parseInt(hash[0].substr(2)) - 1
            hash[1] = parseInt(hash[1])
            console.log(hash, seasons)
            console.log(seasons[hash[0]].episodes[hash[1]])
            var season = seasons[hash[0]];
            var episode = seasons[hash[0]].episodes[hash[1]];
            this.generate(season, episode)
            
        }*/

		window.location.hash = '';
	},
	generate: function () {
		//ga('send', 'event', "generate", "generate");
		console.trace();
		var season = seasons.length;
		season = seasons[Math.floor(Math.random() * season)];

		//if(proceduralSeason) season = proceduralSeason

		var episode = Math.floor(Math.random() * season.episodes.length);
		episode = season.episodes[episode];

		//if(proceduralEpisode) episode = proceduralEpisode

		//ga('send', 'pageview', "episode");
		var arc_id = 's' + season.seasonNumber + 'e' + episode.numeroEpisodio;

		//var quote = episode.hasOwnProperty("quote") ? episode.quote : season.defaultQuote
		var quote = episode.hasOwnProperty('quote') ? episode.quote : undefined;
		var image = episode.hasOwnProperty('image') ? episode.image : season.defaultImage;
		var theme = episode.hasOwnProperty('theme') ? episode.theme : season.defaultTheme;
		var special = episode.hasOwnProperty('special') ? episode.special : undefined;
		var arc = episode.hasOwnProperty('arc') ? episode.arc : undefined;
		var episode_tag = special ? episode.numeroEpisodio : 'e' + episode.numeroEpisodio;

		var base_url = 'images/';

		if (randomWho.xmas == true) base_url = 'images/xmas';
		if (randomWho.regeneration.active == true) base_url = 'images/r';

		if (arc && !this.generated) {
			var arc_html = '';
			if (arc.hasOwnProperty('prev')) {
				for (var e in arc.prev) {
					arc_html +=
						'<span class="episode-arc" style="background-image: url(' +
						base_url +
						'/arc/' +
						arc.prev[e] +
						'.png);width:' +
						sizes[arc.prev[e]] +
						'px;"></span>';
				}
			}
			arc_html +=
				'<span class="episode-arc" style="background-image: url(' +
				base_url +
				'/arc/active/' +
				arc_id +
				'.png);width:' +
				sizes[arc_id] +
				'px;"></span>';

			if (arc.hasOwnProperty('next')) {
				for (var e in arc.next) {
					arc_html +=
						'<span class="episode-arc" style="background-image: url(' +
						base_url +
						'/arc/' +
						arc.next[e] +
						'.png);width:' +
						sizes[arc.next[e]] +
						'px;"></span>';
				}
			}

			document.querySelector('.episode-arcs').innerHTML = arc_html;
		}
		var audio_context = this.audio;

		if (audio_context != null && theme != 'inherit') {
			fadeOut = window.setInterval(() => {
				if (this.volume.gain.value <= 0) {
					this.musica.stop(0);
					this.load(theme + '.txt', () => {
						fadeIn = setInterval(() => {
							if (this.volume.gain.value >= 0.99) {
								window.clearInterval(fadeIn);
							} else {
								this.volume.gain.value = parseFloat(this.volume.gain.value + 0.01).toFixed(2);
							}
						}, 10);
					});
					window.clearInterval(fadeOut);
				} else {
					this.volume.gain.value = parseFloat(this.volume.gain.value - 0.01).toFixed(2);
				}
			}, 10);
		}

		var div = 'generator';
		if (this.generated) div = 'result';

		if (this.generated) document.querySelector('.' + div).style.transition = '2s opacity';
		if (this.generated) document.querySelector('.' + div).style.opacity = 0;

		if (!this.generated) {
			document.querySelector('[data-attr="season"]').innerHTML = 's' + season.seasonNumber;
			//document.querySelector('[data-attr="season"]').removeAttribute('data-attr')

			document.querySelector('[data-attr="ep"]').innerHTML = episode_tag;
			//document.querySelector('[data-attr="ep"]').removeAttribute('data-attr')

			document.querySelector('[data-attr="name"]').innerHTML = episode.nome;
			//document.querySelector('[data-attr="name"]').removeAttribute('data-attr')

			document.querySelector('[data-attr="writer"]').innerHTML = 'bY ' + episode.escritor;
			//document.querySelector('[data-attr="writer"]').removeAttribute('data-attr')

			if (quote != undefined) {
				document.querySelector('.episode-quote h4').style.display = 'block';
				document.querySelector('.episode-quote h4 .quote').innerHTML = quote;
				//document.querySelector('.episode-quote h4 .quote').removeAttribute('data-attr')
			} else {
				document.querySelector('.episode-quote h4').style.display = 'none';
			}

			document.querySelector('.episode-picture').style.backgroundImage = 'url(images/' + image + '.png)';
			document.querySelector('.episode-picture').onerror = function () {
				document.querySelector('.episode-picture').src = 'url(images/' + season.defaultImage + '.png)';
			};
		} else {
			window.setTimeout(function () {
				document.querySelector('.episode-arcs').innerHTML = '';
				if (arc) {
					var arc_html = '';
					if (arc.hasOwnProperty('prev')) {
						for (var e in arc.prev) {
							arc_html +=
								'<span class="episode-arc" style="background-image: url(' +
								base_url +
								'/arc/' +
								arc.prev[e] +
								'.png);width:' +
								sizes[arc.prev[e]] +
								'px;"></span>';
						}
					}
					arc_html +=
						'<span class="episode-arc" style="background-image: url(' +
						base_url +
						'/arc/active/' +
						arc_id +
						'.png);width:' +
						sizes[arc_id] +
						'px;"></span>';

					if (arc.hasOwnProperty('next')) {
						for (var e in arc.next) {
							arc_html +=
								'<span class="episode-arc" style="background-image: url(' +
								base_url +
								'/arc/' +
								arc.next[e] +
								'.png);width:' +
								sizes[arc.next[e]] +
								'px;"></span>';
						}
					}

					document.querySelector('.episode-arcs').innerHTML = arc_html;
				}

				document.querySelector('[data-attr="season"]').innerHTML = 's' + season.seasonNumber;
				//document.querySelector('[data-attr="season"]').removeAttribute('data-attr')

				document.querySelector('[data-attr="ep"]').innerHTML = episode_tag;
				//document.querySelector('[data-attr="ep"]').removeAttribute('data-attr')

				document.querySelector('[data-attr="name"]').innerHTML = episode.nome;
				//document.querySelector('[data-attr="name"]').removeAttribute('data-attr')

				document.querySelector('[data-attr="writer"]').innerHTML = 'bY ' + episode.escritor;
				//document.querySelector('[data-attr="writer"]').removeAttribute('data-attr')

				if (quote != undefined) {
					document.querySelector('.episode-quote h4').style.display = 'block';
					document.querySelector('.episode-quote h4 .quote').innerHTML = quote;
					//document.querySelector('.episode-quote h4 .quote').removeAttribute('data-attr')
				} else {
					document.querySelector('.episode-quote h4').style.display = 'none';
				}

				document.querySelector('.episode-picture').style.backgroundImage = 'url(images/' + image + '.png)';
				document.querySelector('.episode-picture').onerror = function () {
					document.querySelector('.episode-picture').src = 'url(images/' + season.defaultImage + '.png)';
				};
			}, 2000);
		}

		if (!this.generated) document.querySelector('.' + div).style.transition = '2s opacity';
		if (!this.generated) document.querySelector('.' + div).style.opacity = 0;

		this.generated = true;

		window.setTimeout(function () {
			document.querySelector('.' + div).style.display = 'none';
			document.querySelector('.result').style.display = 'inline-block';
			window.setTimeout(function () {
				document.querySelector('.result').style.transition = '2s opacity';
				document.querySelector('.result').style.opacity = 1;
				window.location.hash = arc_id;
				//ga('send', "pageview", window.location.hash);
			}, 10);

			//this.cleanup();
		}, 2000);
	},
	cleanup: function () {
		var cleanup = document.getElementsByClassName('cleanup');
		for (var c = 0; c != cleanup.length; c++) {
			cleanup[c].parentElement.removeChild(cleanup[c]);
		}
	},
	load: function (f, callback) {
		if (!this.ctx) this.ctx = new this.audio();
		if (!this.volume) this.volume = this.ctx.createGain();
		if (!this.mainVolume) this.mainVolume = this.ctx.createGain();
		if (this.firstRun) this.volume.gain.value = 1;
		if (this.firstRun) this.mainVolume.gain.value = 1;
		this.firstRun = false;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.status == 200 && xhr.readyState == 4) {
				this.musica = this.ctx.createBufferSource(); //Creates a buffer that reads array buffers
				var audioData = _base64ToArrayBuffer(xhr.responseText); //b64 into array buffer
				this.ctx.decodeAudioData(audioData, (buffer) => {
					this.musica.buffer = buffer;
					this.musica.connect(this.mainVolume);
					this.mainVolume.connect(this.volume);
					this.volume.connect(this.ctx.destination);
					this.musica.start();

					if (callback) callback();
				});
			}
		};

		xhr.open('GET', 'audio/' + f);
		xhr.send();

		function _base64ToArrayBuffer(base64) {
			var binario = window.atob(base64); //converte para bin
			var arrayBuffer = new Uint8Array(binario.length); //creates a typed array
			for (var i = 0; i < binario.length; i++) {
				arrayBuffer[i] = binario.charCodeAt(i); //char to charCode (A => 65)
			}

			return arrayBuffer.buffer; //Retorna um arrayBuffer dos dados da array
		}
	},
};

randomWho.init();

var watchdog = {
	start: function () {
		window.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		});
		window.addEventListener('dragstart', function (e) {
			preventDefault();
		});
	},
};

watchdog.start();
