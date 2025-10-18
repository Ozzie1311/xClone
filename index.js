import { tweetsData } from './tweetData.js'

document.addEventListener('click', (e) => {
  if (e.target.dataset.like) {
    handleLikes(e.target.dataset.like)
  } else if (e.target.dataset.reply) {
    handleReplies(e.target.dataset.reply)
  } else if (e.target.dataset.retweet) {
    handleRetweets(e.target.dataset.retweet)
  } else if (e.target.id === 'post-button') {
    handlePostButton()
  }
})

function handleLikes(tweetId) {
  const findedTweet = tweetsData.find((tweet) => tweet.uuid === tweetId)

  findedTweet.isLiked ? findedTweet.likes-- : findedTweet.likes++
  findedTweet.isLiked = !findedTweet.isLiked

  renderFeed()
}

function handleRetweets(tweetId) {
  const findedTweet = tweetsData.find((tweet) => tweet.uuid === tweetId)

  findedTweet.isRetweeted ? findedTweet.retweets-- : findedTweet.retweets++
  findedTweet.isRetweeted = !findedTweet.isRetweeted

  renderFeed()
}

function handleReplies(tweetId) {
  document.querySelector(`#replies-${tweetId}`).classList.toggle('hidden')
}

function getHTMLFeed() {
  let feedHTML = ''
  let likeClass = ''
  let retweetClass = ''
  let repliesHTML = ''

  tweetsData.forEach((tweet) => {
    likeClass = tweet.isLiked ? 'liked' : ''
    retweetClass = tweet.isRetweeted ? 'retweeted' : ''

    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        repliesHTML += `
        <div>
          <img src="${reply.profilePic}" alt="Image of ${reply.handle}" class="profile-pic">
          <div>
            <p>${reply.handle}</p>
            <p>${reply.tweetText}</p>
          </div>
        </div>
      `
      })
    }

    feedHTML += `
   
        <article class="tweet">
          <header>
            <img src="${tweet.profilePic}" alt="Profile image of ${tweet.profilePic}" />
            <div class="tweet-information">
              <div class="username-content">
                <p>${tweet.username}</p>
                <p>@${tweet.handle}</p>
              </div>

              <p class="tweet-content">
                ${tweet.tweetText}
              </p>
            </div>
          </header>
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
