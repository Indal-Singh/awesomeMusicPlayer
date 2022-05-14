const audio = document.getElementById('audio');
const progress = $('#progress-bar');
const seek = $('#seek');
const totalDuration = $('#duration');
const currtime = $('#time-current'); 
const masterPlay = $('#master_play');
const masterPause = $('#master_pause');
const preTrack = $('#preTrack');
const nextTrack = $('#nextTrack');
const dlalimg = $('#dlalimg');
const masterTitle = $('#s_title');
const masterArtists = $('#s_artists');
const ronline_box = $('#ronline_box');
const okbtn = $('#okbtn');
const online = $('#online');
const offline = $('#offline');
const masterLoader = $('#master_loader');
let idarray = [1423];

function initializeAudio()
{
    const audioDuration = Math.round(audio.duration);
    seek.attr('max',audioDuration);
    progress.attr('max',audioDuration);
    const fullDuration = formateTime(audioDuration);
    totalDuration.html(`${fullDuration.mint}:${fullDuration.sec}`)
    totalDuration.attr('datetime',`${fullDuration.mint}m ${fullDuration.sec}s`);
}

function formateTime(sec)
{
    const newTime = new Date(sec*1000).toISOString().substr(14,5);
    return {mint:newTime.substr(0,2),sec:newTime.substr(3,2)}
}

function updateTimeCurr()
{
    const cTime = formateTime(Math.round(audio.currentTime));
    currtime.html(`${cTime.mint}:${cTime.sec}`)
    currtime.attr('datetime',`${cTime.mint}m ${cTime.sec}s`);
    
}

function updateProgress()
{
    progress.val(Math.round(audio.currentTime));
    seek.val(Math.round(audio.currentTime));
}

function updateProgressSkip(e)
{
    const skipTime = e.target.value;
    audio.currentTime = skipTime;
    progress.val(skipTime);
    seek.val(skipTime);
}

function togglePlay()
{
    if(audio.paused || audio.ended)
    {
        audio.play();
        masterPlay.css('display','none');
        masterPause.css('display','inline-block');
    }
    else
    {
        audio.pause();
        masterPause.css('display','none');
        masterPlay.css('display','inline-block');
    }
}

function loadingAudio()
{
    masterLoader.show();
    masterPlay.hide();
    masterPause.hide();
}

function loadedAudio()
{
    masterLoader.hide();
    changeIcon();
}

function changeIcon()
{
        if(audio.paused || audio.ended)
    {
        masterPause.css('display','none');
        masterPlay.css('display','inline-block');
    }
    else
    {
        masterPlay.css('display','none');
        masterPause.css('display','inline-block');
    }
}


function checkStatus()
{
    if(window.navigator.onLine)
    {
        offline.hide();
        online.show();
        // ronline_box.hide();
    }
    else
    {
        offline.show();
    }
}


if(window.navigator.onLine==false)
        {
            ronline_box.show();    
        }

  function keyboardShortcuts(event)
   {
    //    console.log(event);
		const { key } = event;
		switch (key) 
        {
			case 'k': togglePlay();
            break;
		}
	}


function NextSong()
{
   $.ajax({
            type: 'post',
            url: 'https://simusic.in/special/fechrandomsong.php',
            data: 'type=next&id=1',
            success: function(result)
         {
            let indal = JSON.parse(result);  
            let alarry = indal.tags.split(", ");
            let albumname = alarry[2];
            let audiolink = 'https://simusic.in/embed/'+indal.id;
            let imglink = 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'_resize2x_200.webp';
            audio.src = audiolink;
            dlalimg.attr("src", imglink);
            idarray[idarray.length]=indal.id;          
            masterTitle.html(indal.name);
            masterArtists.html(indal.singer);
             togglePlay();     
             
             if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: indal.name,
                    artist: indal.singer,
                    album: albumname,
                    artwork: [
                      { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '96x96',   type: 'image/png' },
                      { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '128x128', type: 'image/png' },
                      { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '192x192', type: 'image/png' },
                      { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '256x256', type: 'image/png' },
                      { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '384x384', type: 'image/png' },
                      { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '512x512', type: 'image/png' },
                      
                    ]
                  });
    
                    navigator.mediaSession.setActionHandler('play', function() {audio.play();});
                    navigator.mediaSession.setActionHandler('pause', function() {audio.pause();});
                    navigator.mediaSession.setActionHandler('seekbackward', function() {audio.currentTime = Math.min(audio.currentTime - 10, audio.duration);});
                    navigator.mediaSession.setActionHandler('seekforward', function() {audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);});
                    navigator.mediaSession.setActionHandler('previoustrack', function() { previousSong(); });
                    navigator.mediaSession.setActionHandler('nexttrack', function() { NextSong(); });
                }

         }
    })
}

  function previousSong()
{
    let preid = idarray[idarray.length-1];
   $.ajax({
            type: 'post',
            url: 'https://simusic.in/special/fechrandomsong.php',
            data: 'type=pre&id='+preid,
            success: function(result)
         {
            let indal = JSON.parse(result);  
            let alarry = indal.tags.split(", ");
            let albumname = alarry[2];
            let audiolink = 'https://simusic.in/embed/'+indal.id;
            let imglink = 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'_resize2x_200.webp';
            audio.src = audiolink;
            dlalimg.attr("src", imglink);
            idarray.pop();
            masterTitle.html(indal.name);
            masterArtists.html(indal.singer);
            togglePlay();  

            if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: indal.name,
                artist: indal.singer,
                album: albumname,
                artwork: [
                  { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '96x96',   type: 'image/png' },
                  { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '128x128', type: 'image/png' },
                  { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '192x192', type: 'image/png' },
                  { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '256x256', type: 'image/png' },
                  { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '384x384', type: 'image/png' },
                  { src: 'https://simusic.in/siteuploads/thumb/c/'+indal.category_id+'.jpg', sizes: '512x512', type: 'image/png' },
                  
                ]
              });

                navigator.mediaSession.setActionHandler('play', function() {audio.play();});
                navigator.mediaSession.setActionHandler('pause', function() {audio.pause();});
                navigator.mediaSession.setActionHandler('seekbackward', function() {audio.currentTime = Math.min(audio.currentTime - 10, audio.duration);});
                navigator.mediaSession.setActionHandler('seekforward', function() {audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);});
                navigator.mediaSession.setActionHandler('previoustrack', function() { previousSong(); });
                navigator.mediaSession.setActionHandler('nexttrack', function() { NextSong(); });
            }
         }
    })
}
$('ducument').ready(function(){
    
    audio.addEventListener('timeupdate',updateProgress);
    audio.addEventListener('timeupdate',updateTimeCurr);
    audio.addEventListener('loadedmetadata',initializeAudio);
    audio.addEventListener('loadstart',loadingAudio);
    audio.addEventListener('ended',NextSong);
    audio.addEventListener('loadeddata',loadedAudio);
    audio.addEventListener('play',changeIcon);
    seek.on('input',updateProgressSkip);
    masterPlay.click(togglePlay);
    masterPause.click(togglePlay);
    nextTrack.click(NextSong);
    preTrack.click(previousSong);
    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);
    document.addEventListener('keyup', keyboardShortcuts);
    audio.addEventListener("play", function(){
        masterPlay.css("display", "none");
        masterPause.css("display", "inline-block");
    });  
     audio.addEventListener("pause", function(){
        masterPlay.css("display", "inline-block");
        masterPause.css("display", "none");
    });

    okbtn.click(function(){
        ronline_box.hide();
        setTimeout(function(){
            location.reload();
        },1000);
    });

    setInterval(function () {online.hide();}, 4000);
});
