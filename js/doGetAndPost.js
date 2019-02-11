/* CptS 489 
   IM4 Starter Code
   Web Service for the Speedgolf Rounds Database
   You will implement an API for processing requests to update the speedgolf rounds database.
   Here is the behavior to support:
   
   1. (GET) Given a full player name as a parameter, return a unique player key that can be
      subsequently used to issue post requests to get or update the player's data.
      Here's an example: 
      http://<scripturl>?action=get&playername=Chris%20Hundhausen
      This request returns a unique player id string if the player does not exist, or an error 
      code if the player already exists in the database.

2. (GET) Given a player Id as a paremter, return a JSON object containing the player's existing data
   in the database. 
   Here's an example:
   http://<scripturl>?action=get&playerid=<unique id string>
   This request returns a JSON object with the player's existing data in the database, as in this sample:
    {total: {SGS: "12:34", SGSToPar: "-1:26" str: 8, strToPar: "Even", time: "4:34", timeToPar: "-1:26"},
         1: {holeStr: 4, holeTime: "3:00},
         2: {holeStr: 4: holeTime: "1:34"}}

3. (POST) Given a player Id, hole number (between 1 and 18), number of strokes (between 1 and 10), and
   a hole time ([m]m:ss format), update the player's data in the back-end database to with the new 
   hole data, returning 'Success' if the update succeeded or 'Error: ...', with a description 
   of the error included. 
 
*/

//doGetAndPost -- Process GET and POST requests for the Speedgolf Tournament DB Web Service API
//This function is called from doGet() to handle BOTH get and post requests.

function doGetAndPost(e) {
  var lock;
  
  //1. Lock the Database while this request is processed
  lock = LockService.getDocumentLock();
  lock.waitLock(30000); //lock automatically times out in 30 seconds
  
  //2. Evaluate query parameters and handle request appropriately. Use helper functions as needed.

  /* TO DO: Fill in code here. Make sure to return an error message if query params are invalid. */
  
  //3. Release lock after request has been handled.
  lock.releaseLock();
  
} //doGetAndPPost

//Handle doGet requests by calling doGetAndPost
function doGet(e) {
  return doGetAndPost(e); //Have doGetAndPost handle it.
}

//Handle doPost requests by calling doGetAndPost
function doPost(e) {
  return doGetAndPost(e); //Have doGetAndPost handle it.
}
  
/* generatePlayerKey -- Given a player name (usually "First Name + Last Name) that is known 
  not to exist in the database, this function generates a unique player key.  
*/
function generatePlayerKey(playerId) {
  //TO DO: Fill in code here
}

/* playerExists -- Checks whether a player with playerName exists in the database.
  Return true if a player of that name already exists, false otherwiese. 
*/
function playerExists(playerName) {
  //TO DO: Fill in code here
}
  
/* addPlayer -- Given a (unique) playerId and player name, adds the player to the database
*/
function addPlayer(playerId,playerName) {
  //TO DO: Fill in code here
  /* Implementation hints: 
     - Store the database in a Google sheet with column headers corresponding
       to the data to be stored. Your database should be able to accommodate all data for an 18-hole round
     - Use the top database row to store the stroke and time pars for each hole. You'll ned these for the
       "toPar" stats
     - Remember to create columns to hold the "Total" stats. Use spreadsheet formulas to auto-calculate 
       a player's stats based on the contents of the hole data columns. Here is how to do the calcs:
       - SGS: Add the total number of strokes to the total time, e.g., "8" + "3:34" = "11:34"
       - SGSToPar: Subtract SGS from the SGS Par, which can be calculated as the sum of the stroke pars
         and time pars of all the holes played so far.
       - str: the sum of the strokes of all holes played so far.
       - strToPar: the number of strokes relative to par: Subtract the total number of strokes from the
         sum of the pars of the holes played so far. Note that a 0 value should appear as "Even".
       - time: The sum of the times of all holes played so far.
       - timeToPar: the time relative to par: Subtract the total time from the sum of the time pars 
         of all holes played so far.
    - Store SGS and all tiems in the spreadsheet using the "elapsed time" data type. Format these cells using
      "Elapsed minutes" : "Seconds". This will make all time calculations straightforward
    - When combining strokes and times for SGS calculations, convert strokes to time using the following
      spreadhseet formulat =TIME(0,numStrokes,0)
  */
}

//getPlayerRow -- Given a playerId, this function returns the row at which the player's data resides, or -1
//if the playerId could not be found in the database.
function getPlayerRow(playerId) {
  //TO DO: Fill in code here
}

//updateHoleData -- Given a playerId, hole number, hole strokes and hole time, this function first validates the
//hole data. If the data are valid, the function proceeds to attempt to write the hole data to the database.
//It first searches the database for the (unique) playerId. If it is found, the function then writes
//the (valid) hole data to the database, returning "success". If an error occurs, the function returns a string
//starting with "Error: " and ending with a description of the error.
function updateHoleData(playerId, holeNum, holeStr, holeTime) {
  //TO DO: Fill in code here;
}

//dateToString -- Given a JavaScript Date object, converts it to a colon-separated time string.
function dateToString(date) {
  return ((60 * date.getHours()) + date.getMinutes()) + ":" + date.getSeconds();
}

//zeroPad: Returns a string in which its integer parameter is padded with a leading
//zero if it is < 10.
function zeroPad(num) {
  if (num < 10) {
    return "0" + num.toString();
  } else {
    return num.toString();
  }
}

//SGTimeToString: Converts a time value (Date object) to a SG Time (string in mm:ss format).
//Note: We assume that a player can't be more than 120 minutes under par. This means we 
//interpret any time with hour == 22 or hour == 23 as under par. All other times are interpreted 
//as over par. 
function SGTimeToString(theTime) {
  var theHours, theMinutes, theSeconds;
  if (theTime == null || theTime == "" || !(theTime instanceof Date))
    return "";
  theHours = theTime.getHours();
  if (theHours >= 22) { //we have an under par SG to par score between -0:01 and -59:59...
    theSeconds = theTime.getSeconds();
    if (theSeconds > 0) {
      theMinutes = (theHours == 23 ? 60 - theTime.getMinutes() - 1 : 120 - theTime.getMinutes() - 1);
      theSeconds = 60 - theSeconds;
    }  else {
      theMinutes = (theHours == 23 ? 60 - theTime.getMinutes() : 120 - theTime.getMinutes());
    }
    return "-" + theMinutes + ":" + zeroPad(theSeconds);
  } else { //assume above par
    theMinutes = theTime.getMinutes() + (theHours * 60);
    theSeconds = theTime.getSeconds();
    return theMinutes + ":" + zeroPad(theSeconds);
  } 
}

/*getHoleData -- Given a playerId, this function returns a JavaScript object containing the player's hole data in the following form:
                 {total: {SGS: "[m]m:ss", SGSToPar: "[m]m:ss", str: ##, strToPar: ## or "Even",
                          time: "[m]m:ss", timeToPar: "[m]m:ss"}, 
                  1:     {str: 3, time: "2:32"}, 
                  2: {str: 4, time: 2:12}, ...}
   The returned object has properties corresponding to "total" and each hole numbers for which non-empty data exist.
*/
function getHoleData(playerId) {
 //TO DO: Fill in code here
}