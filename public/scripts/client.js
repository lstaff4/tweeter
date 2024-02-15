/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json


$(document).ready(function() {

  const escape = function(str) {
    // used to stop users from inputting code from the textarea.
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const spaceNormalizer = function(string) {
    //converts serialized spaces into regular spaces, for measurement. Sorry to anyone who wanted to input %20 into their tweets.
    let returnString = '';
    for (let i = 0; i < string.length; i++) {
      if (string[i] === '%' && string[i + 1] === '2' && string[i + 2] === '0') {
        returnString += ' ';
        i += 3;
      }
      returnString += string[i];
    }
    return returnString;
  };

  $("#compose-new-tweet").on("submit", function() {
    // this function composes our submitted text into a tweet.
    let serializedTweet = ($(this).serialize());
    event.preventDefault();

    if ((serializedTweet.length - 5) <= 0) {
      $(".error-message").text("Your tweet was too short!");
      return;
    }

    if ((spaceNormalizer(serializedTweet).length - 5)  > 140) {
      $(".error-message").text("Your tweet was too long!");
      return;
    }

    $.post("/tweets", serializedTweet, function(data) {
      $.ajax('/tweets', {method: 'GET'})
        .then(function (loadedTweets) {
          $(".tweet-container").prepend(createTweetElement(loadedTweets[loadedTweets.length - 1]));
        // this above line seems like a lot, but it's the same way we load all of the tweets,
        // except we're only loading the last element in the array instead of all of them.
        });
      $('#tweet-text').val('');
      $(".error-message").text(" ");

    });
  });
  
  const createTweetElement = function(tweet) {
    //creates a tweet element from a given object.
    let $tweet = ` 
    <article class="tweet">
      <header>
        <div class="personal-profile">
          <img src=${tweet.user.avatars}>
          <span class="tweeter-name">${tweet.user.name}</span>
        </div>
        <span class="tweeterat">${tweet.user.handle}</span>
      </header>
      <span class="tweet-text">${escape(tweet.content.text)}</span>
      <footer>
        <span class="time-since-tweet">${timeago.format(tweet.created_at)}</span>
        <span class="tweet-interacts">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-arrows-rotate"></i>
          <i class="fa-solid fa-heart"></i>
        </span> 
      </footer>
    </article>
    `;
  
    return $tweet;
  };
  
  const renderTweets = function(tweets) {
    // loops through tweets
  
    for (let post of tweets) {
      // calls createTweetElement for each tweet
      let $newTweet = createTweetElement(post);
      $(".tweet-container").prepend($newTweet);
      // takes return value and appends it to the tweets container
    }
  
  };

  const loadtweets = function() {
    //grabs all tweets and calls renderTweets on them.
    $.ajax('/tweets', {method: 'GET'})
      .then(function(loadedTweets) {
        renderTweets(loadedTweets);
      });
  };

  loadtweets();

});
