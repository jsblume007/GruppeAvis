define(['common/js/lib/Serum.Pubsub', 'common/js/lib/util/loader'], function (Pubsub, Loader) {
  return {
    initialize: initialize.bind(undefined, Pubsub, Loader)
  };
});
/**
 * @typedef { Object } PlayerProps
 * @property {{src: string, srcset:string}} posterData
 * @property {string} psId
 * @property {string} ga
 * @property {undefined|"LATEST"|"DEFAULT"} type
 * @property {string} videoOffset nrkno-player calls this: startTime
 * @property {string} aspectRatio
 * @property {"true"|"false"} lazyAutoplay
 */

/**
 * @param {Element} element
 * @param {Partial<PlayerProps>} props
 */
function initialize(Pubsub, Loader, element, props) {
  Loader.loadJS('https://static.nrk.no/nrkno-player/major/2/nrkno-player-entry.js', {async: ''});

  function initializeNrknoPlayerOnElement(element) {
    var flowItemsContainer = document.querySelectorAll(
      '.newsroom-top-flow .flow-content .flow-relation'
    );

    var isVideoFirstInNewsTopRoom =
      flowItemsContainer &&
      flowItemsContainer.length &&
      flowItemsContainer.length > 0 &&
      flowItemsContainer[0].contains(element);

    element.classList.remove('js-initialize');

    if (!isVideoFirstInNewsTopRoom && isCompilationPlugChild(element)) {
      return;
    }

    // signal that a video is prepared for playback to Pubsub
    /**
     * @param {HTMLElement} containerElement parent container
     * @param {HTMLElement} playerElement nrkno-player
     */
    function onPlayerInitialize(containerElement, playerElement) {
      var mediaElement = {
        player: playerElement, // nrkno-player
        view: containerElement // root html element
      };
      // video-brief-lean needs to remove 'Video' label
      Pubsub.publish(Pubsub.topics.VIDEO_DID_PREPARE, mediaElement);

      if (containerElement.closest && containerElement.closest('a')) {
        // The player is the child of an `a` tag. Invalid html, but we
        // should prevent navigating on Player clicks
        containerElement.addEventListener('click', function preventEventLeaking(event) {
          event.preventDefault();
        })
      }
    }

    initializeNrknoPlayer(element, props, onPlayerInitialize);
  }

  initializeNrknoPlayerOnElement(element);
}

/**
 *
 * @param {Element|Document} element
 */
function isCompilationPlugChild(element) {
  while (element && element !== document) {
    if (
      element.classList.contains('compilation') &&
      element.classList.contains('plug')
    ) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
}

/**
 * @param {Element} element
 * @param {Partial<PlayerProps>} props
 */
function initializeNrknoPlayer(element, props, onPlayerInitialize) {
  var playerContainer = element.querySelector('.media-player-container');

  /**
   * @param {PlayerProps} props
   */
  function parsedPlayerPropsSuccess(props) {
    var playerHtml = getPlayerHtml(props);
    var playerElement;
    if (playerContainer) {
      playerContainer.innerHTML = playerHtml;
      playerElement = playerContainer.firstElementChild
    } else {
      element.innerHTML = playerHtml;
      playerElement = element.firstElementChild
    }

    onPlayerInitialize(element, playerElement)
  }

  parsePlayerProps(element, props, parsedPlayerPropsSuccess);
}

/**
 * @param {Element} element
 * @param {Partial<PlayerProps>} props
 * @param {(playerHtml: PlayerProps) => void} parsedPropsCallback
 */
function parsePlayerProps(element, props, parsedPropsCallback) {
  var parsedVideoOffset = isNaN(parseInt(props.videoOffset, 10))
    ? '0'
    : props.videoOffset;
  var posterData = getPosterdataFromElement(element);

  if (props.type !== 'LATEST') {
    parsedPropsCallback({
      aspectRatio: props.aspectRatio || '1x1',
      posterData: posterData,
      psId: props.psId,
      ga: props.ga,
      lazyAutoplay: props.lazyAutoplay,
      type: props.type,
      videoOffset: parsedVideoOffset
    });
  } else {
    /**
     * @param {string|undefined} latestId
     */
    function latestEpisodeIdSuccess(latestId) {
      var idToUse = latestId || props.psId;
      parsedPropsCallback({
        aspectRatio: props.aspectRatio || '1x1',
        posterData: posterData,
        psId: idToUse,
        ga: props.ga,
        lazyAutoplay: props.lazyAutoplay,
        type: props.type,
        videoOffset: parsedVideoOffset
      });
    }
    getLatestEpisodeId(props.psId, latestEpisodeIdSuccess);
  }

  return;
}

/**
 * @param {Element} element
 * @returns {Object | undefined}
 */
function getPosterdataFromElement(element) {
  var imgTag = element.querySelector('img');

  if (imgTag === null) {
    return {};
  }

  return {
    src: imgTag.getAttribute('src'),
    srcset: imgTag.getAttribute('srcset')
  };
}

/**
 * @param {PlayerProps} props
 * @return {string} html
 */
function getPlayerHtml(props) {
  return [
    '<nrkno-player',
    'class="-player aspect-ratio aspect-ratio--${aspectRatio}"',
    'type="player"',
    'src="nrk:${id}"',
    'ga="${ga}"',
    'shareorigin="https://www.nrk.no/video"',
    'intersectionthreshold="[0.8,0.2]"',
    'disableAutopause=""',
    props.lazyAutoplay === 'true' ? 'lazyAutoplay=""' : '',
    props.videoOffset !== '0' ? 'startTime="${videoOffset}"' : '',
    props.posterData ? '.posterData="${posterData}"' : '',
    '></nrkno-player>'
  ]
    .join(' ')
    .replace('${aspectRatio}', props.aspectRatio)
    .replace('${id}', props.psId)
    .replace('${ga}', props.ga)
    .replace('${videoOffset}', props.videoOffset)
    .replace(
      '${posterData}',
      JSON.stringify(props.posterData).replace(/"/g, '&quot;')
    );
}

/**
 * @param {string} seriesId
 * @param {(playerId: string | undefined) => void} callback
 */
function getLatestEpisodeId(seriesId, callback) {
  var url = 'https://psapi.nrk.no/series/${seriesId}/latestOrNextEpisode/mediaelement'.replace(
    '${seriesId}',
    seriesId
  );

  // json might be empty object
  function latestEpisodeIdSuccess(json) {
    callback(json.id);
  }

  ajaxFetch(url, latestEpisodeIdSuccess);
}

function ajaxFetch(url, callback) {
  var ajax = new window.XMLHttpRequest();
  ajax.onload = function () {
    var responseText = this.responseText;
    var payload = JSON.parse(responseText);
    callback(payload);
  };

  ajax.onerror = function () {
    callback({});
  };

  ajax.open('GET', url, true);
  ajax.send();
}
