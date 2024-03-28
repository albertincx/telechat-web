export {}

declare global {
  interface Console {
    everything: any;
    defaultLog: any;
    defaultError: any;
    defaultWarn: any;
    defaultDebug: any;
  }
  interface Window {
    __arsfChat: any;
    __arsfChatIdg: any;
    __arsfChatUrl: any;
    __arsfChatIdu: any;
    __arsfChatEmmitter: any;
    __arsfChatInBackground: any;
    instantChatBotUidName: any;
    __arsfShowGreetings: any;
    location: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    instantChatBot: any;
  }
}
