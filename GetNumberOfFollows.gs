function checkReport(){
  try{
  var targetList = getTargetList(); 
    for(var i = 0; i< targetList.length; i++){
      insertReportData(targetList[i]);
      targetList.splice(i--,1);
    }
  } catch(e){
    Logger.log(e);
  }
}

function getTargetList(){
  try{
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('target');
    var data = sheet.getDataRange().getValues();
    var targetList = [];
    for(var i=0;i<data.length;i++){
      targetList.push(data[i][0])
    }
    return targetList;
  } catch(e){
     throw(e);
  }
}

function insertReportData(userId){
  try{
    var data = getData(userId);
    var sheet = "";
    
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    Logger.log(sheets);
    for(var i=0; i<sheets.length;i++){
      if(userId == sheets[i].getName()){
        sheet = spreadsheet.getSheetByName(userId);
      }
    }
    if(sheet == ""){
      //シートがなければ作成する
      spreadsheet.insertSheet(userId);
      sheet = spreadsheet.getSheetByName(userId);
      sheet.appendRow(['datetime','follower','follow','post']);
    }
    var lastRow =sheet.appendRow(data);
  } catch(e){
     throw(e);
  }
}

function getData(userId){
  try{
    var url = "https://www.instagram.com/" + userId;
    var request = UrlFetchApp.fetch(url);
    var content = request.getContentText();
    
    //実行日付
    var today = new Date();
    
    //フォロワー数取得
    var regex = new RegExp('"\\d.*Followers');
    var followers = content.match(regex)[0].replace(" Followers","").replace("\"","");
  
    //フォロー数取得
    regex = new RegExp('\\s\\d.*Following');
    var followings = content.match(regex)[0].replace(" Following","");
    
    //ポスト枚数数取得
    regex = new RegExp('\\s\\d.*Posts');
    var posts = content.match(regex)[0].replace(" Posts","").replace(/\s\d.*\s/,"");
    
    var result = [today,followers,followings,posts];
    return result;
  } catch(e){
     throw(e);
  }
  
}