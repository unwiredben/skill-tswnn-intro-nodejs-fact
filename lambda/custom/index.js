// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// core functionality for fact skill
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    // gets a random fact by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomFact = requestAttributes.t('FACTS');
    // concatenates a standard message with the random fact
    const speakOutput = requestAttributes.t('GET_FACT_MESSAGE') + randomFact;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
  //              This handler will not be triggered except in those locales, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

// translations
const enData = {
  translation: {
    SKILL_NAME: 'The Show With No Name Intros',
    GET_FACT_MESSAGE: 'Here\'s Cinco!',
    HELP_MESSAGE: 'You can say play an intro or start the show, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Show With No Name Intro skill can\'t help you with that.  It can give you a show intro if you ask it to start the show. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Warning: friends may leave at any time.',
        'Warning: If you miss someone enough, they will return.',
        'Tonight, we\'re going to party like it\'s 1999.',
        'We\'re dumbing down the show to improve our Nielsens.',
        'I love your mother',
        'Episode I: A Whole New Generation of Dorks',
        'I will not take a course of action that will lead this planet to Corey.',
        'I\'m dead, Jim.',
        'Stephen, LOOK OUT!',
        'Warning: No surprises tonight',
        'I guess we just don\'t appeal to "readers".',
        'The Show With No Name is brought to you by the letters \'F\' and \'U\'.',
        'The Show With No Name is about to give away $10,000 in cash and prizes.',
        'We won two awards and we still don\'t have a name.',
        'Some call it the forbidden dance...',
        'Boogers don\'t burn',
        'damn good fudge',
        'nominated for six golden showers',
        'last caller gets a free hot dog',
        'we like tv but we don\'t "like" tv',
        'tonight: a very special show with no name',
        'easter: the chocolate celebration of Jesus',
        'you know, that Batman\'s got a purty mouth',
        'This show is dedicated to all the hot mamas.',
        'Alex Jones is trying to silence me. SHHHH!',
        'Never shake a baby... unless it\'s already retarded.',
        'Hail to the Thief',
        'Daddy got white pee on my front butt.',
        'Lenny Kravitz would be a successful musician if he just applied himself',
        'For Valentine\'s, I want twat surgery.',
        'David Komie is a lawyer. April fools!',
        'How about an apology for being Commies?',
        'Jesus has risen, and He\'s come for your brains.',
        'WARNING: This show contains adult content and is too hot for television..',
        'If old movies are so good, why are they still making new ones?',
        'You\'re all dead to me.',
        'I\'ve got a huge hard on for America',
        'You think the Bush\'s drink a lot.',
        'Smoking isn\'t bad for you if you do it outside.',
        'I\'m your father.',
        'To the victor go the spoils.',
        'Surgeon General Warning: Smoke offs can be fatal.',
        'Don\'t dolphins suck?',
        'So, how\'s the apocalypse treating ya?',
        'You like us.  Half of you really like us.',
        'Bob Hope is alive... unless this is a rerun.',
        'Be american. Blow a fireman.',
        'Be more afraid of lightning.',
        'Note to self: become a war profiteer',
        'Sometimes naughty is nice',
        'My fart smells like whiskey.',
        'Tejano soccer dads, you made a powerful enemy tonight.',
        'The Queen is dead.  Long live Zombie Queen',
        'Check here for three dollars to go to the shadow government.',
        'Come inside my rectory.',
        'Austin: the live... (quiet) live music capital.',
        'Remember the fallen soldiers?  Yeah, me too.',
        'What would Jesus do for Fathers Day?',
        'Tonight\'s show is never before seen.',
        'Tonight\'s show is brought to you by the letter \'T\'.',
        'News Flash! One-balled man wins race.',
        'If you\'d like a transcript of tonight\'s show, you\'re a dork.',
        'Stupid? Stupid like a fox.',
        'I feel sick.  Sick like a fox.',
        'We will rock you.  We will roll you.  We will fe-fi-fo you.',
        'Sasquatch gut you down?',
        'You\'re a dirty, dirty, dirty, dirty, dirty, dirty, dirty, dirty girl.',
        'You voted us best show.  Fools!',
        'On access, no one can hear you scream.',
        'Remember, it gets dark an hour earlier now... Spooky!',
        'If you loved me, you\'d let me eat your brain.',
        'Ms. Ryder, I sentence you to Caged Heat.',
        'WARNUM: Indians are stupid, and how!',
        'Bevo doesn\'t give a shit about your team\'s tragedies.'
        'Hey Strom!  Die already!  A baby is ready to be born.',
        'Warning: Christmas in coming... All over your face.',
        'Orphans piss me off.',
        'Other cultures are weird.',
        'DISCLAIMER: The show is not responsible for contestant deaths.',
        'She loves me.  She loves me nuts.',
        'Make love, not war... like Michael Jackson.',
        'I told you Great White fucking sucks.',
        'Spring forward or the terrorists win.',
        'Happy Birthday, Bob Hope... I SAY HAPPY BIRTHDAY.',
        'I just flew in from China and boy...',
        'Heard about the new pirate flu?  It\'s called AAARRRS.',
        'I like the word poon-tang because it reminds me of orange juice and fucking.',
        'Welcome to Austin, bikers.  Don\'t touch anything.',
        'Attention: One-balled wonder leads the race.',
        'Adbay ayday for Uday and Qusay',
        'Don\'t be 100.',
        'Today we mourn Gregory Hines.  He was seventy degrees.',
        'Abused kids, one.  Catholic priests, zero.',
        'Never, never, never, never, never, never, never, never, never forget.',
        'Two\'s company, three\'s a crowd.',
        'Bow to the kings of access television...',
        'The Republicans tried to keep us off the air, but we fought back with rock-n-roll.',
        'I\'m thankful that my mom didn\'t sell me to Michael Jackson.',
        'WARNING: The Japanese are sneaky.',
        'Men are from Mars.  Women like penis.',
        'It\'s not TV.  It\'s access.',
        'I have a dream.  I have a cream dream.',
        'NOTICE We\'re not going to play your stupid band\'s stupid video.',
        'Will you be my valentine, or at least, give me a blowjob?',
        'Sure, I\'m married, but I wanna be gay-married.',
        'Rape is not funny.  Unless you rape a clown.',
        'The governor fucks a little boy... and WE get pulled off the air.',
        'Christ has died.  Christ is risen.  Christ will be back after these messages.',
        'The funniest part of the toilet is the ball-cock.',
        'I used to think chemistry was useless... Until I poisoned all my enemies.',
        'Ronald Reagan died last week.  He was seventy degrees.',
        'Kittie porn?  Meee-Yow!',
        'I like hobos, but I can\'t eat a whole one.',
        'Lance Armstrong is in second place... And he only has one ball.',
        'Rick James is dead, bee-yotch!',
        'Julia Childs died this week.  She was seventy degrees.',
        'Remember when going for the gold meant paying a hooker to pee on you?',
        'The Emmy for poontang goes to yo\' mama.',
      ],
  },
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  'en': enData
};
