import { tweetsData } from './tweetData.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

let data = tweetsData
let tweetIdToDelete = null

document.addEventListener('click', (e) => {
  if (e.target.dataset.like) {
    handleLikes(e.target.dataset.like)
  } else if (e.target.dataset.reply) {
    handleReplies(e.target.dataset.reply)
  } else if (e.target.dataset.retweet) {
    handleRetweets(e.target.dataset.retweet)
  } else if (e.target.id === 'post-button') {
    handlePostButton()
  } else if (e.target.dataset.remove) {
    handleRemoveTweet(e.target.dataset.remove)
  }
})

const acceptButton = document.querySelector('#accept-button')
const cancelButton = document.querySelector('#cancel-button')

/* Listeners for the modal buttons */
acceptButton.addEventListener('click', () => {
  data = data.filter((tweet) => tweet.uuid !== tweetIdToDelete)

  renderFeed()

  closeModal()
})

cancelButton.addEventListener('click', closeModal)

function openModal() {
  document.querySelector('.overlay').classList.toggle('hidden-modal')
}

function closeModal() {
  document.querySelector('.overlay').classList.toggle('hidden-modal')

  tweetIdToDelete = null
}

function handleRemoveTweet(tweetId) {
  tweetIdToDelete = tweetId
  openModal()
}

function handlePostButton() {
  const tweetInput = document.querySelector('#tweet-input')
  if (tweetInput.value) {
    const newTweet = {
      handle: `@AlgunaCuenta 💎`,
      username: 'MividaBella',
      profilePic: `images/troll.jpg`,
      likes: 80,
      retweets: 4,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
      chart: 8.3,
    }

    data.unshift(newTweet)

    tweetInput.value = ''
    renderFeed()
  }
}

function handleLikes(tweetId) {
  const findedTweet = data.find((tweet) => tweet.uuid === tweetId)

  findedTweet.isLiked ? findedTweet.likes-- : findedTweet.likes++
  findedTweet.isLiked = !findedTweet.isLiked

  renderFeed()
}

function handleRetweets(tweetId) {
  const findedTweet = data.find((tweet) => tweet.uuid === tweetId)

  findedTweet.isRetweeted ? findedTweet.retweets-- : findedTweet.retweets++
  findedTweet.isRetweeted = !findedTweet.isRetweeted

  renderFeed()
}

function handleReplies(tweetId) {
  const findedTweet = data.find((tweet) => tweet.uuid === tweetId)

  if (findedTweet.replies.length > 0) {
    document.querySelector(`#replies-${tweetId}`).classList.toggle('hidden')
  }
}

function getHTMLFeed() {
  let feedHTML = ''
  let likeClass = ''
  let retweetClass = ''

  data.forEach((tweet) => {
    likeClass = tweet.isLiked ? 'liked' : ''
    retweetClass = tweet.isRetweeted ? 'retweeted' : ''
    let repliesHTML = ''

    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        repliesHTML += `
        <div class="reply-container">
          <img class="profile-pic" src="${reply.profilePic}" alt="Image of ${reply.handle}" class="profile-pic">
          <div class="tweet-information">
            <p class="username">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
          </div>
        </div>
      `
      })
    }

    feedHTML += `
   
        <article class="tweet">
        <div class="remove-tweet"><i class="fa-solid fa-ellipsis-vertical" data-remove="${tweet.uuid}"></i></div>
      <header >
        <img src="${tweet.profilePic}" alt="Profile image of ${tweet.profilePic}" class="profile-pic" />
        <div class="tweet-information">
          <div class="username-content">
            <p class="username">${tweet.username}</p>
            <p class="handle">${tweet.handle}</p>
            </div>
          <p class="tweet-text">
            ${tweet.tweetText}
          </p>
          <footer>
            <i class="fa-solid fa-comment-dots" data-reply="${tweet.uuid}">
              <span>${tweet.replies.length}</span>
            </i>
            <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}">
              <span>${tweet.retweets}</span>
            </i>
            <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}">
              <span>${tweet.likes}k</span>
            </i>
            <i class="fa-solid fa-chart-simple">
              <span>${tweet.chart}k</span>
            </i>
            <i class="fa-solid fa-share-nodes"></i>
          </footer>
        </div>
      </header>
      <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHTML}
      </div>
    </article>

    
        
    `
  })

  return feedHTML
}

function renderFeed() {
  const feedHTML = getHTMLFeed()
  document.querySelector('#feed').innerHTML = feedHTML
}

renderFeed()
