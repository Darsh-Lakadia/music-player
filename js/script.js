const wrapper = document.querySelector(".wrapper"),
    musicImg = document.querySelector(".img-area img"),
    musicName = document.querySelector(".song-details .name"),
    musicArtist = document.querySelector(".song-details .artist"),
    mainAudio = document.getElementById("main-audio"),
    playPauseBtn = document.querySelector(".play-pause"),
    prevBtn = document.querySelector("#prev"),
    nextBtn = document.querySelector("#next"),
    progressArea = document.querySelector(".progress-area"),
    progressBar = document.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicbtn = musicList.querySelector("#close");




let musicIndex = Math.floor(Math.random() * allMusic.length) + 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

//load music 
function loadMusic(indexNo) {
    musicName.innerText = allMusic[indexNo - 1].name;
    musicArtist.innerText = allMusic[indexNo - 1].artist;
    musicImg.src = `images/${allMusic[indexNo - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNo - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerHTML = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerHTML = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic();
     playingNow();
}
//previous music function
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic();
     playingNow();
}

//play or or pause btn event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
     playingNow();
});


nextBtn.addEventListener("click", () => {
    nextMusic();
})

prevBtn.addEventListener("click", () => {
    prevMusic();
})

//update the progress bar according to current music time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    let progressWidth = (currentTime / duration)*100;
    progressBar.style.width = `${progressWidth}%`

    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");

        mainAudio.addEventListener("loadeddata",()=> {

            //update song's total duration
            let audioDuration = mainAudio.duration;

            let totalMin = Math.floor(audioDuration /60 );
            let totalSec = Math.floor(audioDuration % 60 );
            if(totalSec < 10){
                totalSec = `0${totalSec}`;
            }
            musicDuration.innerText = `${totalMin} : ${totalSec}`;
        });
    
    //update playing song current time
    let currentMin = Math.floor(currentTime/60 );
    let currentSec = Math.floor(currentTime % 60 );
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin} : ${currentSec}`;
});


//update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    //if music is paused, click on progress bar , music will play
    playMusic(); 
})

//repeat, suffle change icon
const repeatBtn =wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click" ,() => {

    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","Song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title","Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title","Playlist looped")
            break;
    }
});

//repeat, suffle  action
mainAudio.addEventListener("ended" ,() => {

    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor( (Math.random() * allMusic.length) + 1);

            do{
                randIndex = Math.floor( (Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", ()=> {
    musicList.classList.toggle("show");
});
hideMusicbtn.addEventListener("click", ()=> {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index = ${i + 1}>
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);

    let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag  = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=> {
         
            let audioDuration =liAudioTag.duration;

            let totalMin = Math.floor(audioDuration / 60 );
            let totalSec = Math.floor(audioDuration % 60 );
            if(totalSec < 10){
                totalSec = `0${totalSec}`;
            }
            liAudioTagDuration.innerText = `${totalMin} : ${totalSec}`;
            liAudioTagDuration.setAttribute("t-duration", `${totalMin} : ${totalSec}`);
    })
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        allLiTags[j].setAttribute("onClick","clicked(this)");
    }

}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}