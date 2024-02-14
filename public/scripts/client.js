/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
$(document).ready(function(){

  const spaceNormalizer = function(string) {
    let returnString = ''
    for (i = 0; i < string.length; i++) {
      if (string[i] === '%' && string[i + 1] === '2' && string[i + 2] === '0') {
        returnString += ' '
        i += 3;
      }
      returnString += string[i]
    }
    return returnString;
  }

  $("#compose-new-tweet").on("submit", function() {
    let serializedTweet = ( $( this ).serialize() );
    event.preventDefault();

    if ((serializedTweet.length - 5) <= 0) {
      alert("Your tweet is too short.");
      return;
    }

    if ((spaceNormalizer(serializedTweet).length - 5)  > 140) {
      alert(`Your tweet is too long.`)
      return;
    }

    $.post("/tweets", serializedTweet, function(data) {
      alert("Serialized tweet received successfully");
    })
  })


  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png"
  //       ,
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd" },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1461113959088
  //   }
  // ]
  
  
  const createTweetElement = function(tweet) {
    let $tweet = ` 
    <article class="tweet">
      <header>
        <div class="personal-profile">
          <img src=${tweet.user.avatars}>
          <span class="tweeter-name">${tweet.user.name}</span>
        </div>
        <span class="tweeterat">${tweet.user.handle}</span>
      </header>
      <span class="tweet-text">${tweet.content.text}</span>
      <footer>
        <span class="time-since-tweet">${timeago.format(tweet.created_at)}</span>
        <span class="tweet-interacts">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-arrows-rotate"></i>
          <i class="fa-solid fa-heart"></i>
        </span> 
      </footer>
    </article>
    `
  
    return $tweet;
  };
  
  const renderTweets = function(tweets) {
    // loops through tweets
  
    for (let post of tweets) {
      // calls createTweetElement for each tweet
      let $newTweet = createTweetElement(post);
      $(".tweet-container").append($newTweet);
      // takes return value and appends it to the tweets container
    } 
  
  };  

  const loadtweets = function() {
    $.ajax('/tweets', {method: 'GET'})
    .then(function (loadedTweets) {
      renderTweets(loadedTweets);
    });
  };

  loadtweets();

})
