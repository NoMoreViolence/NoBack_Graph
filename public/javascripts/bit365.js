define(['react', 'game-logic/clib', 'autolinker', 'actions/AdminActions', 'actions/ChatActions', 'stores/GameSettingsStore', 'stores/ChatStore', 'components/ChatChannelSelector'], function(React, Clib, Autolinker, AdminActions, ChatActions, GameSettingsStore, ChatStore, ChatChannelSelectorClass) {
  var replaceUsernameMentions = function(autolinker, match) { if (match.getType() !== 'twitter') return true; var username = match.getTwitterHandle(); return '<a href="/user/' + username + '" target="_blank">@' + username + '</a>'; };
  var escapeHTML = (function() { var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;' }; return function(str) { return String(str).replace(/[&<>"']/g, function(s) { return entityMap[s]; }); }; })();
  var D = React.DOM;
  var ChatChannelSelector = React.createFactory(ChatChannelSelectorClass);
  var SCROLL_OFFSET = 120;

  function getState() {
    var state = ChatStore.getState().toObject();
    state.ignoredClientList = GameSettingsStore.getIgnoredClientList();
    state.history = state.channels.getIn([state.currentChannel, 'history']);
    return state;
  }
  var ChatMessageClass = React.createClass({
    displayName: 'ChatMessage',
    mixins: [React.addons.PureRenderMixin],
    propTypes: { message: React.PropTypes.object.isRequired, username: React.PropTypes.string, ignoredClientList: React.PropTypes.object.isRequired, botsDisplayMode: React.PropTypes.string.isRequired },
    render: function() {
      var message = this.props.message;
      var username = this.props.username;
      console.assert(message.hasOwnProperty('mid'));
      console.assert(typeof message.mid === 'number');
      var pri = 'msg-chat-message';
      switch (message.type) {
        case 'say':
          if (this.props.ignoredClientList.hasOwnProperty(message.username.toLowerCase()))
            return null;
          if (message.bot || /^!/.test(message.message)) {
            if (this.props.botsDisplayMode === 'none')
              return null;
            pri += ' msg-bot';
            if (this.props.botsDisplayMode === 'greyed')
              pri += ' bot-greyed';
          }
          if (message.role === 'admin')
            pri += ' msg-admin-message';
          var r = new RegExp('@' + username + '(?:$|[^a-z가-힣0-9_\-])', 'i');
          if (username && message.username != username && r.test(message.message)) { pri += ' msg-highlight-message'; }
          var msgDate = new Date(message.date);
          var timeString = ((msgDate.getHours() < 10) ? ('0' + msgDate.getHours()) : msgDate.getHours()) + ':' + ((msgDate.getMinutes() < 10) ? ('0' + msgDate.getMinutes()) : msgDate.getMinutes()) + ' ';
          return D.li({ className: pri }, D.span({ className: 'time-stamp' }, timeString), D.a({ href: '/user/' + message.username, target: '_blank' }, message.username, ':'), ' ', D.span({ className: 'msg-body', dangerouslySetInnerHTML: { __html: Autolinker.link(escapeHTML(message.message), { truncate: 50, replaceFn: replaceUsernameMentions }) } }));
        case 'mute':
          pri = 'msg-mute-message';
          return D.li({ className: pri }, D.a({ href: '/user/' + message.moderator, target: '_blank' }, '*** <' + message.moderator + '>'), message.shadow ? '' : '', D.a({ href: '/user/' + message.username, target: '_blank' }, '<' + message.username + '> 님은 '), '하루동안 채팅이 금지입니다.');
        case 'unmute':
          pri = 'msg-mute-message';
          return D.li({ className: pri }, D.a({ href: '/user/' + message.moderator, target: '_blank' }, '*** <' + message.moderator + '>'), message.shadow ? '' : '', D.a({ href: '/user/' + message.username, target: '_blank' }, '<' + message.username + '> 채팅금지 해제'));
        case 'error':
        case 'info':
        case 'client_message':
          pri = 'msg-info-message';
          return D.li({ className: pri }, D.span(null, ' *** ' + message.message));
        default:
          return null;
      }
    }
  });
  var ChatMessage = React.createFactory(ChatMessageClass);
  return React.createClass({
    displayName: 'Chat',
    propTypes: { isMobileOrSmall: React.PropTypes.bool.isRequired },
    getInitialState: function() { this.listLength = 0; return getState(); },
    componentDidMount: function() {
      ChatStore.addChangeListener(this._onChange);
      GameSettingsStore.addChangeListener(this._onChange);
      if (this.refs.messages) {
        var msgsNode = this.refs.messages;
        msgsNode.scrollTop = msgsNode.scrollHeight;
      }
    },
    componentWillUnmount: function() {
      ChatStore.removeChangeListener(this._onChange);
      GameSettingsStore.removeChangeListener(this._onChange);
    },
    componentDidUpdate: function(prevProps, prevState) {
      if (this.state.connectionState !== 'JOINED')
        return;
      if (this.state.lastEvent === 'JOINED' || this.state.lastEvent === 'CHANGED_CHANNEL') {
        var msgsNode = this.refs.messages;
        msgsNode.scrollTop = msgsNode.scrollHeight;
      } else if (this.state.history.size != this.listLength) {
        this.listLength = this.state.history.size;
        if (this.refs.messages) {
          var msgsBox = this.refs.messages;
          var scrollBottom = msgsBox.scrollHeight - msgsBox.offsetHeight - msgsBox.scrollTop;
          if (scrollBottom < SCROLL_OFFSET)
            msgsBox.scrollTop = msgsBox.scrollHeight;
        }
      }
    },
    _onChange: function() {
      if (this.isMounted())
        this.setState(getState());
    },
    _sendMessage: function(e) {
      if (e.keyCode == 13) {
        var msg = e.target.value;
        msg = msg.trim();
        if (!this._doCommand(msg)) {
          if (msg.length >= 1 && msg.length < 500) {
            this._say(msg);
            e.target.value = '';
          }
        } else { e.target.value = ''; }
      }
    },
    _doCommand: function(msg) {
      var cmdReg = /^\/([a-zA-z]*)\s*(.*)$/;
      var cmdMatch = msg.match(cmdReg);
      if (!cmdMatch)
        return;
      var cmd = cmdMatch[1];
      var rest = cmdMatch[2];
      switch (cmd) {
        case 'ignore':
          if (this.state.username === rest) { ChatActions.showClientMessage('Cant ignore yourself'); } else if (Clib.isInvalidUsername(rest)) { ChatActions.showClientMessage('Invalid Username'); } else if (!this.state.ignoredClientList.hasOwnProperty(rest.toLowerCase())) {
            ChatActions.ignoreUser(rest);
            ChatActions.showClientMessage('User ' + rest + ' ignored');
          } else
            ChatActions.showClientMessage('User ' + rest + ' was already ignored');
          return true;
        case 'unignore':
          if (Clib.isInvalidUsername(rest)) { ChatActions.showClientMessage('Invalid Username'); } else if (this.state.ignoredClientList.hasOwnProperty(rest.toLowerCase())) {
            ChatActions.approveUser(rest);
            ChatActions.showClientMessage('User ' + rest + ' approved');
          } else
            ChatActions.showClientMessage('User ' + rest + ' was already approved');
          return true;
        case 'ignored':
          ChatActions.listMutedUsers(this.state.ignoredClientList);
          return true;
        case 'pause':
          AdminActions.pause();
          return true;
        case 'resume':
          AdminActions.resume();
          return true;
        default:
          return false;
      }
    },
    _say: function(msg) { ChatActions.say(msg); },
    _selectChannel: function(channelName) { return function() { ChatActions.selectChannel(channelName); }; },
    _closeChannel: function() { ChatActions.closeCurrentChannel(); },
    render: function() {
      var self = this;
      var state = this.state;
      var chatMessagesContainer;
      var chatInput;
      var chatInputPlaceholder;
      var chatInputOnKeyDown = null;
      var chatInputDisabled = false;
      var chatInputClass = 'chat-input';
      switch (state.connectionState) {
        case 'CONNECTING':
          chatMessagesContainer = D.div({ className: 'loading-container' });
          chatInputPlaceholder = '접속 중...';
          chatInputDisabled = true;
          break;
        case 'JOINING':
          chatMessagesContainer = D.div({ className: 'loading-container' });
          chatInputPlaceholder = '접속 중...';
          chatInputDisabled = true;
          break;
        case 'JOINED':
          chatMessagesContainer = renderCurrentChannelMessages();
          if (state.username) {
            chatInputPlaceholder = '여기에 메시지를 입력하세요...';
            chatInputOnKeyDown = this._sendMessage;
          } else {
            chatInputPlaceholder = '채팅하시려면 로그인 하세요...';
            chatInputDisabled = true;
          }
          break;
        case 'DISCONNECTED':
          chatMessagesContainer = renderCurrentChannelMessages();
          chatInputPlaceholder = '연결 안 됨...';
          chatInputDisabled = true;
          chatInputClass += ' 연결 종료';
          break;
      }

      function renderCurrentChannelMessages() { var messages = self.state.history.map(function(msg) { return ChatMessage({ key: msg.mid, message: msg, username: self.state.username, ignoredClientList: self.state.ignoredClientList, botsDisplayMode: self.state.botsDisplayMode }); }); return D.ul({ className: 'messages', ref: 'messages' }, messages); }
      chatInput = D.input({ className: chatInputClass, onKeyDown: chatInputOnKeyDown, maxLength: '500', ref: 'input', placeholder: chatInputPlaceholder, disabled: chatInputDisabled });
      var channelTabs = [];
      if (state.connectionState !== 'CONNECTING') {
        state.channels.forEach(function(channelObject, channelName) {
          channelObject = channelObject.toObject();
          var isCurrentChannel = state.currentChannel === channelName;
          var isClosable = isCurrentChannel && channelName != 'english' && channelName != 'moderators';
          var hasUnread = channelObject.unreadCount != 0;
          var onClickHandler = isClosable ? self._closeChannel : isCurrentChannel ? null : self._selectChannel(channelName);
          channelTabs.push(D.div({ className: 'tab', key: channelName, onClick: onClickHandler }, isClosable ? D.i({ className: 'fa fa-times close-channel' }) : null, isCurrentChannel ? D.div({ className: 'selected-border' }) : null, hasUnread ? D.span({ className: 'unread-counter' }, channelObject.unreadCount) : null, D.img({ src: '/img/flags/' + channelName + '.png' })));
        });
      }
      return D.div({ id: 'chat' }, D.div({ className: 'tabs-container' }, D.div({ className: 'tabs-scroller' }, channelTabs)), chatMessagesContainer, D.div({ className: 'chat-input-container' }, chatInput, ChatChannelSelector({ selectChannel: this._selectChannel, selectedChannel: state.currentChannel, isMobileOrSmall: this.props.isMobileOrSmall, moderator: state.isModerator })), D.div({ className: 'spinner-pre-loader' }));
    }
  });
});
