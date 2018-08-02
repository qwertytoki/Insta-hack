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
      //�V�[�g���Ȃ���΍쐬����
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
    
    //���s���t
    var today = new Date();
    
    //�t�H�����[���擾
    var regex = new RegExp('"\\d.*Followers');
    var followers = content.match(regex)[0].replace(" Followers","").replace("\"","");
  
    //�t�H���[���擾
    regex = new RegExp('\\s\\d.*Following');
    var followings = content.match(regex)[0].replace(" Following","");
    
    //�|�X�g�������擾
    regex = new RegExp('\\s\\d.*Posts');
    var posts = content.match(regex)[0].replace(" Posts","").replace(/\s\d.*\s/,"");
    
    var result = [today,followers,followings,posts];
    return result;
  } catch(e){
     throw(e);
  }
  
}