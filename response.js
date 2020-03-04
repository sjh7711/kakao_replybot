var reloadcheck = 0;
var stop = 0;
File = java.io.File;
if(ObjKeep.get("reboottime")==null){
	ObjKeep.keep("reboottime",new Date().getTime());
}
var reloadtime = new Date().getTime();
var calculating = 0;
var D = require("DBManager.js")("D");
var T = require("ThreadManager.js");
var I = require("Interactive.js");
const es=String.fromCharCode(8237).repeat(500);

function readFile(file) {
	var filedir = new java.io.File(file);
	var br = new java.io.BufferedReader(new java.io.FileReader(filedir));
	var readStr = "";
	var str = null;
	while (((str = br.readLine()) != null)) {
		readStr += str + "\n";
	}
	br.close();
	return readStr.trim();
}

function writeFile(file, str) {
	var filedir = new java.io.File("/sdcard/" + file);
	var bw = new java.io.BufferedWriter(new java.io.FileWriter(filedir));
	bw.write(str.toString());
	bw.close();
}

function backup(r) {
	var folder = time().year + "." + time().month + "." +  time().date + " " +  time().hour + "H " + time().minute + "M " + time().second + "S"
	File("/sdcard/kbotbackup/" + folder).mkdir();
	var backup = File("/sdcard/kbot/functions").listFiles();
	for (var i in backup) {
		writeFile("kbotbackup/" + folder + "/" + String(backup[i]).substr(23), readFile(backup[i]));
	}
	var response = "/sdcard/kbot/response.js";
	writeFile("kbotbackup/" + folder + "/" + "response.js" , readFile(response));
	Api.replyRoom(r.room, "전체 Backup 완료");
}

var funccheck = 0;

if(funccheck == 0 ){
	T.interruptAll();
	for (var i in File("/sdcard/kbot/functions").listFiles()) {
		eval(readFile(File("/sdcard/kbot/functions").listFiles()[i]));
	}
	funccheck = 1;
}

function freload(r) {
	backup(r);
	T.interruptAll();
	for (var i in File("/sdcard/kbot/functions").listFiles()) {
		eval(readFile(File("/sdcard/kbot/functions").listFiles()[i]));
	}
	Api.replyRoom(r.room, "Function reloading 완료");
}

function reload(r) {
	if (r.sender == "배주현") {
		backup(r);
		var Timer = new Date();
		Api.replyRoom(r.room, "Reloading Start\n" + time().now);
		reloadcheck = 1;
		reloadtime = new Date().getTime();
		Api.reload();
		reloadcheck = 0;
		java.lang.Thread.sleep(1500);
		T.interruptAll();
		for (var i in File("/sdcard/kbot/functions").listFiles()) {
			eval(readFile(File("/sdcard/kbot/functions").listFiles()[i]));
		}
		Api.replyRoom(r.room, "Reloading End / " + ((new Date() - Timer) / 1000) + "s\n" + time().now);
	}
}

function blankFunc(r){}
function blankFunc1(r){}

Flag=(function(){
	   var list={};
	   var Flag={};
	   Flag.set=function(flag,room,value){
		  if(list[flag]===undefined){ 
			 list[flag]={};
			 list[flag][room]=value;
		  }else list[flag][room]=value;
	   }
	   Flag.get=function(flag,room){
		  return (list[flag] && list[flag][room]) || 0;
	   }
	   return Flag;
	})();

function controlEdit(r) {
	I.register("controlEdit", r.room, r.sender, function (input) {
		var edit = String(readFile(File("/sdcard/kbot/functions/control.js")));		
		var temp1 = '';
		var temp2 = '';
		var msg;
		var i = 0;
		r.replier.reply("방을 선택하세요\n" + roomList.map(v=> (1 + i++) + ". " + v ).join("\n"));
		msg = input.getMsg() * 1;
		if (!isNaN(msg) && msg >= 1 && msg <= roomList.length) {
			temp1 = roomList[Number(msg-1)];
			var msg;
			var i = 0;
			r.replier.reply("기능을 선택하세요\n" + functionList.map(v=> (1 + i++) + ". " + v ).join("\n"));
			msg = input.getMsg() * 1;
			if (!isNaN(msg) && msg >= 1 && msg <= functionList.length) {
				temp2 = Number(msg-1);
				var msg;
				r.replier.reply("켜려면 1, 끄러면 0을 입력하세요");
				msg = input.getMsg() * 1;
				if( msg == 0 ){
					controlList[temp1][temp2] = 0;
					r.replier.reply("수정 완료");
				} else if ( msg == 1 ) {
					controlList[temp1][temp2] = 1;
					r.replier.reply("수정 완료");
				} else {
					r.replier.reply('잘못 입력했습니다.');
					return;
				}
			} else {
				r.replier.reply('잘못 입력했습니다.');
				return;
			}
		} else {
			r.replier.reply('잘못 입력했습니다.');
			return;
		}
	})
}

const funccList = ['!날씨','!실검','!로또', '!시간', '!명단', '!쪽지','!메뉴','!식당','!맛집','!서브웨이','!유튜브','!노래','!가사','!제이플라','!번역','!오버워치','!주사위','!건의']
const funccList1 = ['!최근채팅','!야구','!블랙잭'];
const funccList3 = ['!사진조회', '!사진삭제', '!사진목록','!전체채팅']
const funccList4 = ['!방','!쓰레드','!디비','!로드','!로딩','!리부트']

function funcCheck(r) {
	var str1 = "!날씨\n이 외의 기능은 전체보기를 통해 확인해주세요."+es+"\n\n";
	for (var i = 1; i < funccList.length ; i++) {
		str1 += funccList[i] + "\n";
	}
	if ( r.room == '관리' ) {
		for (var i = 0; i < funccList3.length ; i++) {
			str1 += funccList3[i] + "\n";
		}
	}
	if ( r.room == '관리' || r.room =='봇방' ) {
		for (var i = 0; i < funccList4.length ; i++) {
			str1 += funccList4[i] + "\n";
		}
	}
	for (var i = 0; i < funccList1.length ; i++) {
		if(controlList[r.room][i] == 1){
			str1 += funccList1[i] + "\n";
		}
	}
	return str1.trim();
}

write64 = function (file, base64) {
	var base64Array = new java.lang.String(base64).getBytes();
	var fileArray = android.util.Base64.decode(base64Array, android.util.Base64.DEFAULT);
	var is = new java.io.ByteArrayInputStream(fileArray);
	var os = new java.io.FileOutputStream(file);
	var len = 0;
	var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1000);
	while ((len = is.read(buf)) != -1) {
		os.write(buf, 0, len);
	}
	is.close();
	os.close();
}

function saveImage(r) {
	if (r.imageDB.getImage()) {
		var i = String(r.imageDB.getImage());
		var file = "storage/emulated/0/KakaoTalkDownload/" + r.sender.replace(/ /g, "").replace(/\//g, '') + "." + r.room.replace(/ /g, "") + "-" + time().year + "." + time().month + "." + time().date + time().day + "." + time().hour + "." + time().minute + "." + time().second + ".jpg";
		write64(file, i);
		//Api.replyRoom("관리", "Image saved|" + r.room + "-" + r.sender);
	}
}

time = function () {
	var today = new Date();
	var dayNames = ["(일요일)", "(월요일)", "(화요일)", "(수요일)", "(목요일)", "(금요일)", "(토요일)"];
	var day = dayNames[today.getDay()];
	var year = today.getFullYear(), month = today.getMonth() + 1, date = today.getDate(), hour = today.getHours(), minute = today.getMinutes(), second = today.getSeconds();
	ampm = hour >= 12 ? "PM" : "AM";
	hour1 = hour % 12;
	if(String(hour1) == 0){
		hour1 = '12'
	}
	hour1 = hour1 < 10 ? "0" + hour1 : hour1;
	hour = hour < 10 ? "0" + hour : hour;
	minute = minute < 10 ? "0" + minute : minute;
	second = second < 10 ? "0" + second : second;
	var now = year + "년 " + month + "월 " + date + "일 " + day + " " + hour1 + ":" + minute + ":" + second + " " + ampm;
	return {now: now, year: year, month: month, date: date, day: day, hour: hour, minute: minute, second: second, ampm: ampm, hour1: hour1};
}

function isread(is) {
	var br = new java.io.BufferedReader(new java.io.InputStreamReader(is));
	var readStr = "";
	var str = null;
	while (((str = br.readLine()) != null)) {
		readStr += str + "\n";
	}
	br.close();
	return readStr.trim();
}

function cmd(dir) {
	var p = java.lang.Runtime.getRuntime().exec("su -c \"\"" + dir + "\"\"");
	p.waitFor();
	var r = p.getInputStream() || p.getErrorStream();
	return isread(r);
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
function response(room, msg, sender, isGroupChat, replier, imageDB) {
	var r = {replier: replier, msg: msg, sender: sender, room: room, imageDB: imageDB};
	I.run(room, sender, msg);
	try {
		if (room == "관리" || room == "봇방") {
			if (msg.indexOf("]") == 0) {
				replier.reply(String(eval(msg.substring(1))).encoding());
				return;
			}
			if (msg == "!test") {
				replier.reply(String(eval(readFile("/sdcard/kbot/evalpad.js"))).encoding());
			}
			blankFunc(r);
		}
	}
	catch (e) {
		replier.reply(e + "\n" + e.stack);
	}
	try {
		blankFunc1(r);		
		if (sender != "시립봇" || room != "가족" || room != "블랙" || room != "야구" || room != "기타") {
			D.insert("chatdb", {time: time().hour + ":" + time().minute + ":" + time().second, name: sender, msg: msg, room: room});
		}
		if (msg == "사진을 보냈습니다.") {
			saveImage(r);
		}
		
		if( D.selectForArray('poemlist', null, "name = ? and room = ?", [r.sender, r.room] ) != 0 ){
			poem(r);
		}
		
		if (msg.indexOf("vs") > -1 ) {
			vs(r);
		}
		if (msg.indexOf("주현") > -1 || msg.indexOf("피치") > -1 || msg.indexOf("\uc885\ud654") > -1 || msg.indexOf("\uc2E0\ucAD1") > -1) {
			Api.replyRoom("관리", room + " | " + sender + "\n" + msg);
		}
		if (reloadcheck == 1) {
			return;
		}
		if (stop == 1) {
			return;
		}
		if (msg == "!로딩" && ( room == '봇방' || room == '관리' )) {
			reload(r);
			return;
		}
		if (msg == "!로드" && ( room == '봇방' || room == '관리' )) {
			freload(r);
			return;
		}
		if ((msg.indexOf("!사진조회") == 0 && room == '관리') || Flag.get("image", r.room) == 1) {
			loadimage(r);
		}
		if (msg.indexOf("!사진목록") == 0 && room == '관리') {
			checkimage(r);
		}
		if (msg.indexOf("!사진삭제") == 0 && room == '관리') {
			deleteimage(r);
		}
		if (msg == "!리부트" && ( room == '봇방' || room == '관리' )) {
			replier.reply("Rebooting...");
			cmd("reboot");
		}
		if (msg.indexOf("!날씨") == 0 || msg.indexOf("!ㄴㅆ") == 0) {
			weather(r);
			return;
		}
		if (msg.indexOf("!실검") == 0) {
			naver(r);
			return;
		}
		if (msg.indexOf("!가사 ") == 0 ) {
			if( msg.substr(4).length > 0){
				lyrics(r);
				return;
			} else {
				r.replier.reply('검색할 단어가 너무 짧습니다.')
			}
		}
		if (msg.indexOf('!쪽지 ') == 0){
			poemsend(r);
			return;
		}
		if (msg == '!쪽지목록' && room == '관리'){
			poemlistcheck(r);
			return;
		}
		if (msg == '!쪽지정리' && room == '관리'){
			poemclean(r);
			return;
		}
		if (msg.indexOf("!시간 ") == 0 || msg == "!시간" ){
			 globaltime(r);
			 return;
		}
		if (msg.indexOf('!명단 ') == 0 || msg == '!명단'){
			roomnamelist(r);
			return;
		}
		if (msg == "!로또확률") {
			var str = "";
			str += "1등 확률 : 1/8,145,060\n0.000012277380399898834%\n";
			str += "2등 확률 : 1/1,357,510\n0.000073664282399393%\n";
			str += "3등 확률 : 1/35,724\n0.002799238607098869%\n";
			str += "4등 확률 : 1/733\n0.1364256480218281%\n";
			str += "5등 확률 : 1/45\n2.2222222222222%";
			replier.reply(str);
			return;
		}
		if (msg == "!로또개수목록" ) {
			lottocount(r);
			return;
		}
		if (msg == "!로또통계" ) {
			bestlotto(r);
			return;
		}
		if (msg.indexOf("!행복회로") == 0 ) {
			flottocheck(r);
			return;
		}
		if (msg.indexOf("!로또") == 0) {
			lotto(r);
			return;
		}
		if (msg.indexOf("!당첨") == 0 ) {
			lottocheck(r);
			return;
		}
		if (msg == "!종합로또통계" ) {
			allbestlotto(r);
			return;
		}
		if (msg == "!내로또" ) {
			mylotto(r);
			return;
		}
		if (msg == "!메뉴" ) {
			menurecom(r);
			return;
		}
		if (msg.indexOf("!식당") == 0 ) {
			recom(r, "res");
			return;
		}
		if (msg.indexOf("!맛집 ") == 0 ) {
			famous(r);
			return;
		}
		if (msg == "!서브웨이" ){
			subway(r);
			return;
		}
		if (msg.indexOf("!유튜브 ") == 0 || msg.indexOf("/유튜브 ") == 0) {
			youtube(r);
			return;
		}
		if (msg == "!노래") {
			music(r);
			return;
		}
		if (msg.indexOf("!제이플라") == 0) {
			jfla(r);
			return;
		}
		if (msg.indexOf("!최근채팅") == 0 && controlList[room][0] == 1) {
			recentchat(r);
			return;
		}
		if (msg.indexOf("!전체채팅") == 0 && room == '관리') {
			allchat(r);
			return;
		}
		if (msg.indexOf("!오버워치 ") == 0 ) {
			overwatch(r);
			return;
		}
		if (msg.indexOf("!주사위") == 0) {
			randomnumber(r);
			return;
		}
		if (msg.indexOf("!번역") == 0 ) {
			translation(r);
			return;
		}
		if (msg.indexOf("!건의 ") == 0 ) {
			suggestion(r);
		}
		if (msg == "!방" && ( room == '봇방' || room == '관리' )) {
			checkroom(r);
			return;
		}
		if (msg == "!쓰레드" && ( room == '봇방' || room == '관리' )) {
			thread(r);
			return;
		}
		if (msg == "!디비" && ( room == '봇방' || room == '관리' )) {
			db(r);
			return;
		}
		if (msg.indexOf("!기능 ") == 0) {
			func(r);
			return;
		}
		if (msg == "/기능" && room != '자생') {
			replier.reply("!기능으로 작동합니다 " + es + "\n\n" + funcCheck(r).replace("이 외의 기능은 전체보기를 통해 확인해주세요.‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭\n\n", "") + "자세한 기능 설명을 원하면 !기능 [기능명] 으로 검색해주세요.");
			return;
		}
		if (msg == "!기능") {
			replier.reply(funcCheck(r) + es + "\n자세한 기능 설명을 원하면 !기능 [기능명] 으로 검색해주세요.");
			return;
		}
		if (msg.indexOf("!온오프") == 0 && room == '관리') {
			controlEdit(r);
			return;
		}
		if (msg == "!상태") {
			checkstatus(r);
			return;
		}
		if (D.selectForArray("blackjack", "name", "room=?", room) == undefined || D.selectForArray("blackjack", "name", "room=?", room).map(v => v[0]).indexOf(sender) == -1) {
			D.insert("blackjack", {name: sender, room: room, point: 1000000000, win: 0, lose: 0, push: 0, ddl: 0, ddw: 0, ddp: 0, blackjack: 0, even: 0, evenc: 0, insurc: 0, insur: 0, splitc: 0, split: 0, sur: 0, allp: 0, insurw: 0, fexit: 0, bpush: 0, bank: 0, autobet: 0});
		}
		if (msg.indexOf("!블랙잭자동배팅") == 0) {
			blackjackautobetting(r);
			return;
		}
		if ((msg == "!블랙잭" &&  controlList[room][2] == 0) || (msg == "!블랙잭방" &&  controlList[room][2] == 1)) {
			replier.reply("https://open.kakao.com/o/grdPBAnb 로 입장해주세요. 중복되지 않는 자신만의 닉네임을 설정하셔야됩니다. 중복되는 닉네임으로 게임을 진핼할 경우 제재당할 수 있습니다.");
			return;
		}
		if (msg == "!블랙잭정보" ) {
			blackinform(r);
			return;
		}
		if (msg.indexOf("!블랙잭지급") == 0 && room == "관리") {
			givemoney(r);
			return;
		}
		if (msg.indexOf("!블랙잭대출") == 0) {
			lent(r);
			return;
		}
		if (msg.indexOf("!블랙잭상환") == 0) {
			repay(r);
			return;
		}
		if (msg == "!블랙잭랭킹") {
			r.replier.reply(blackjackranking(r));
			return;
		}
		if ((msg.indexOf("!블랙잭") == 0 &&  controlList[room][2] == 1) || (Flag.get("gameinfo", r.room) != 0 && (!isNaN(msg) || msg.indexOf("참가") == 0 || msg == "ㅊㄱ" || msg == "시작" || msg == "ㅅㅈ" || msg == "!블랙잭종료" || msg == "힛" || msg == "ㅎ" || msg == "스테이" || msg == "ㅅㅌㅇ" || msg == "서렌더" || msg == "ㅅㄹㄷ" || msg == "더블다운" || msg == "ㄷㅂㄷㅇ" || msg == "스플릿" || msg == "ㅅㅍㄹ"))) {
			if (Math.random() * 1000 < 1) {
				jackpot(r);
			}
			blackjack(r);
		}
		if ((msg == "!야구" &&  controlList[room][1] == 0) || msg == "!야구방") {
			replier.reply("https://open.kakao.com/o/gQwX2Shb 로 입장해주세요. 중복되지 않는 자신만의 닉네임을 설정하셔야됩니다. 중복되는 닉네임으로 게임을 진핼할 경우 제재당할 수 있습니다.");
			return;
		}
		if (msg == "!전적초기화" && D.selectForArray("baseball", "clear", "room=? and name = ?", [room, sender]) > 0) {
			var point = D.selectForArray("baseball", "point", "room=? and name = ?", [room, sender])[0][0] - 2000;
			var clear = D.selectForArray("baseball", "clear", "room=? and name = ?", [room, sender])[0][0] - 1;
			D.update("baseball", {point: point, win: 0, lose: 0, solowin: 0, clear: clear}, "name=? and room=?", [sender, room]);
			replier.reply(sender + "님의 정보가 초기화 되었습니다.");
			inform(r);
			return;
		}
		if (msg == "!야구정보") {
			inform(r);
			return;
		}
		if (msg == "!야구랭킹") {
			var i = 1;
			replier.reply("전체 순위\n" + es + D.selectForArray("baseball", ["point", "win", "lose", "solowin", "name"], "room=?", r.room, {orderBy: "point desc"}).map(v => String(i++).extension(" ", 2) + ". [" + String(v[0]).extension(" ", 6) + "P " + String(v[1]).extension(" ", 2) + "승 " + String(v[2]).extension(" ", 2) + "패 " + String(v[3]).extension(" ", 3) + "S/P ] " + String(v[4])).join("\n"));
			return;
		}
		if (Flag.get("gameinfo", r.room).start == 1 || Flag.get("gameinfo", r.room).start1 == 1 || Flag.get("gameinfo", r.room).start2 == 1 || Flag.get("gameinfo", r.room).start3 == 1 || Flag.get("gameinfo", r.room).start4 == 1) {
			if (msg == "!야구") {
				r.replier.reply("블랙잭이 진행중입니다.");
				return;
			} else {
				return;
			}
		}
		if (D.selectForArray("baseball", "name", "room=?", room) == undefined || D.selectForArray("baseball", "name", "room=?", room).map(v => v[0]).indexOf(sender) == -1) {
			D.insert("baseball", {name: sender, point: 100000, room: room, win: 0, lose: 0, solowin: 0, clear: 2});
		}
		if ((msg == "!야구" &&  controlList[room][1] == 1) || ((Flag.get("start", r.room) == 1 || Flag.get("start1", r.room) == 1 || Flag.get("start2", r.room) == 1) && (!isNaN(msg) || msg == "참가" || msg == "시작" || msg == "!야구종료" || msg == "!힌트" || msg == "!패스"))) {
			baseball(r);
		}
	}
	catch (e) {
		Api.replyRoom("관리", 'Room : ' + r.room + '\nMsg : ' + r.msg + '\n' + e + "\n" + e.stack);
	}
}