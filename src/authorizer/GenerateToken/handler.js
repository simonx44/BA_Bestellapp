/**
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 *
 * Beschreibung: Die Funktion erweitert den JWT-Token, der zuvor von Cognito erstellt wird.
 * Hierbei fügt dieser innerhalb eines Scopes die Benutzergruppe eines Nutzers hinzu, sodass über das API-Gateway eine Nutzer autorisiert werden kann
 */
 exports.authorizer = async (event, context, callback) => {
  let newScopes = event.request.groupConfiguration.groupsToOverride.map(
    (item) => `${item}-${event.callerContext.clientId}`
  );

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        scope: newScopes.join(" "),
      },
    },
  };

  callback(null, event);
};
