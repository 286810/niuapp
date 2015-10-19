angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '李晨',
    lastText: '范冰冰叫你回家吃饭',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',
    'pos': 'left',
    time: new Date().getTime()
  }, {
    id: 1,
    name: '黄晓明',
    lastText: 'Baby 叫你洗衣服',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460',
    'pos': 'left',
    time: new Date().getTime()
  }, {
    id: 2,
    name: '周杰伦',
    lastText: '昆凌叫你抱孩子',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg',
    'pos': 'left',
    time: new Date().getTime()
  }, {
    id: 3,
    name: '汪峰',
    lastText: '章子怡等着你哦!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png',
    'pos': 'left',
    time: new Date().getTime()
  }, {
    id: 4,
    name: '王思聪',
    lastText: '老公虐我千百遍，我待老公如初恋！',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png',
    'pos': 'left',
    time: new Date().getTime()
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
