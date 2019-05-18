foodbank = function (r){
	try{
		var name = r.msg.split(" ")[1];
		if(typeof name == 'string'){
			var temp=D.selectForArray('foodbank',null,'name like ? or manager like ? or tel like ? or phone like ? or fax like ? or email like ? or addr like ?', ['%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%']);
			var str = temp.map(v=>v[0]+'\n\n'+v[1]+'\n\n번호 : '+v[2]+'\n\n휴대폰 : '+v[3]+'\n\n팩스 : '+v[4]+'\n\n'+v[5]+'\n\n'+v[6]  ).join('\n-----------------\n');
			r.replier.reply(str);
		} else {
			var temp=D.selectForArray('foodbank',null,'name like ? or manager like ? or tel like ? or phone like ? or fax like ? or email like ? or addr like ?', ['%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%','%'+name+'%']);
			var str = temp.map(v=>v[0]+'\n\n'+v[1]+'\n\n번호 : '+v[2]+'\n\n휴대폰 : '+v[3]+'\n\n팩스 : '+v[4]+'\n\n'+v[5]+'\n\n'+v[6]  ).join('\n-----------------\n');
			r.replier.reply(str);
		}
	}catch(e){
		Api.replyRoom('test',e+"\n"+e.stack);
		}
}

banklist = function (r){
	try{
		var name = r.msg.split(" ")[1];
		if(typeof name == 'string'){
			var temp=D.selectForArray('bankls',null,'name like ?','%'+name+'%');
			for(var i=0;i<temp.length;i++){
				temp[i]=temp[i].join(" : ")
				if(i==3){
					temp[2]=temp[2]+es;
				}
			}
			r.replier.reply("      기관명      |      전화번호\n----------------------------------\n"+temp.join("\n\n"));
		} else {
			var temp=D.selectForArray('bankls');
			for(var i=0;i<temp.length;i++){
				temp[i]=temp[i].join(" : ")
				if(i==3){
					temp[2]=temp[2]+es;
				}
			}
			r.replier.reply("      기관명      |      전화번호\n----------------------------------\n"+temp.join("\n\n"));
		}
	}catch(e){
		Api.replyRoom('test',e+"\n"+e.stack);
		}
}