weather = function (r){
	I.register("weatherSelect"+r.sender,r.room,r.sender,function(input){
		try{
			var want = r.msg.substr(4);
			var link1 = ""; // 날씨 검색화면
			var link2 = 'https://m.weather.naver.com/m/main.nhn?regionCode=03220111'; //네이버날씨기본주소
			var check = link2.indexOf('weather'); //link2 String에 weather이 있는지 검사
			var where = "통영시 무전동";
			if(r.room == '시립대 자취생 생정' || r.room == '시립대 전전컴 톡방'|| r.room == '시립대 봇제작방'|| r.room == '시립대 단톡방'){
				link2= 'https://m.weather.naver.com/m/main.nhn?regionCode=09230104';
				check = link2.indexOf('weather');
				where = "서울시립대";
			}
			if(want.length > 0){ //!날씨 ~뒤에 뭔가가 있을 때
	        	link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query="+want+"+날씨").get();
	    		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
	    		var	check = link2.indexOf('weather');
	    		where = want; // 지역명
	    		var temp = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=날씨+"+want).get().select('div.sort_box._areaSelectLayer').select('div.select_lst._selectLayerLists').select('a').toArray() //같은 이름의 지역이 있는지 확인
	    		
	    		if ( temp.length > 1 || (check == -1 && link2 != 'http://m.weather.naver.com/m/nation.nhn')){ //네이버에 날씨검색이 바로 안될 때 1
	    			if (temp.length > 1){ //네이버에서 같은 이름의 지역이 2곳 이상일 때 ex) 고성, 광주
			        	var i=0; //name의 번호에 필요
			        	var navername = temp.map(v=> (1+i++) +". "+ v.text()+' '); //장소명들
	    			}
		        	var temp = org.jsoup.Jsoup.connect("https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q="+want).get();
		        	if(String(temp).indexOf('addressColl') > -1){
		        		if(String(temp).indexOf('지번주소') > -1){//구체적인주소 죽림5로 56, 중림로 10
		        			var name0 = temp.select('div.mg_cont.clear').select('dl.dl_comm').select('span.txt_address').select('span.f_l').text();
		        			var name1 = temp.select('div.mg_cont.clear').select('div.wrap_tit').select('span.f_etit').text();
		        			var i = 1;
		        			var name2 = temp.select('div.mg_cont.clear').select('div.wrap_relspace').select('a').toArray().map(v=>(1+i++)+". "+v.text().replace('..', ''));
		        			if(name2.length > 0){
		        				var name = [];
		        				name.push('1. ' + name1);
		        				name = name.concat(name2);
		        				var msg;
					        	r.replier.reply("장소를 선택하세요\n"+name.join("\n"));
					        	msg=input.getMsg()*1;
					        	if(!isNaN(msg) && msg>=1 && msg<=name.length){
					        		var targetNum=msg-1;
					        		var want = name[targetNum].split('. ')[1];
					        		var temp = org.jsoup.Jsoup.connect("https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q="+want).get();
					        		var name0 = temp.select('div.mg_cont.clear').select('dl.dl_comm').select('span.txt_address').select('span.f_l').text();
				        			var name1 = temp.select('div.mg_cont.clear').select('div.wrap_tit').select('span.f_etit').text();
					        	}
		        			}
		        			var wantplace="";
			        		var temp = name0;
				        	var loc = temp.substr(0, temp.lastIndexOf("면 ")+1);
				        	var loc1 = temp.substr(0, temp.lastIndexOf("읍 ")+1);
				        	var loc2 = temp.substr(0, temp.lastIndexOf("동 ")+1);  //각 이름들의 주소
				        	var loc3 = temp.substr(0, temp.lastIndexOf("가 ")+1);
				        	if( loc.length > 0){
			        			wantplace=loc;
			        		} else if (loc1.length > 0){
			        			wantplace = loc1;
			        		} else if(loc2.length > 0){
			        			wantplace = loc2;
			        		} else if(loc3.length > 0){
			        			wantplace = loc3;
			        		} else {
			        			var temp = name1;
					        	var loc = temp.substr(0, temp.lastIndexOf("면 ")+1);
					        	var loc1 = temp.substr(0, temp.lastIndexOf("읍 ")+1);
					        	var loc2 = temp.substr(0, temp.lastIndexOf("구 ")+1);
					        	var loc3 = temp.substr(0, temp.lastIndexOf("시 ")+1);
					        	if( loc.length > 0){
				        			wantplace=loc;
				        		} else if (loc1.length > 0){
				        			wantplace = loc1;
				        		} else if(loc2.length > 0){
				        			wantplace = loc2;
				        		} else if(loc3.length > 0){
				        			wantplace = loc3;
				        		}
			        		}
				        	link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨+"+wantplace).get();
				        	link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
				        	if(link2.indexOf('regionCode')==-1){
			        			link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=+"+wantplace+"날씨").get();
				        		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
			        		}
				        	check = link2.indexOf('weather');
				        	where = want;
				        	if(check == -1 || String(temp).length == 0){
			        			r.replier.reply("검색이 불가능합니다.");
								return;
			        		}
		        		}else{//와룡, 영산, 같은 주소가 여러군데 일 때  중구
		        			var name = [];
			        		name.push('1. '+temp.select('div.mg_cont.clear.admin_area').select('div.wrap_tit').select('span').text()+' ');
			        		var i = 1;
			        		name = name.concat(temp.select('div.mg_cont.clear.admin_area').select('div.wrap_relspace').select('a').toArray().map(v=>(1+i++)+". "+v.text().replace('..', '')+' '));
			        		if(navername != undefined){
			        			if(navername.length >= name.length){
				        			name = navername;
				        		}
			        		}
			        		var msg;
				        	r.replier.reply("장소를 선택하세요\n"+name.join("\n"));
				        	msg=input.getMsg()*1;
				        	if(!isNaN(msg) && msg>=1 && msg<=name.length){
				        		var targetNum=msg-1;
				        		var wantplace="";
				        		var temp = name[targetNum].substr(3);
				        		var loc = temp.substr(0, temp.lastIndexOf("면 ")+1);
					        	var loc1 = temp.substr(0, temp.lastIndexOf("읍 ")+1);
					        	var loc2 = temp.substr(0, temp.lastIndexOf("동 ")+1);  //각 이름들의 주소
					        	var loc3 = temp.substr(0, temp.lastIndexOf("가 ")+1);
					        	var loc4 = temp.substr(0, temp.lastIndexOf("군 ")+1);
					        	var loc5 = temp.substr(0, temp.lastIndexOf("구 ")+1);
					        	var loc6 = temp.substr(0, temp.lastIndexOf("시 ")+1);
				        		if( loc.length > 0){
				        			wantplace=loc;
				        		} else if (loc1.length > 0){
				        			wantplace = loc1;
				        		} else if(loc2.length > 0){
				        			wantplace = loc2;
				        		} else if(loc3.length > 0){
				        			wantplace = loc3;
				        		} else if(loc4.length > 0){
				        			wantplace = loc4;
				        		} else if(loc5.length > 0){
				        			wantplace = loc5;
				        		} else if(loc6.length > 0){
				        			wantplace = loc6;
				        		} else {
				        			wantplace = temp;
				        		}
				        		link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=+"+wantplace+"날씨").get();
				        		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
				        		if(link2.indexOf('regionCode')==-1){
				        			link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨+"+wantplace).get();
					        		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
				    			}
				        		check = link2.indexOf('weather');
				        		where = name[targetNum].substr(3);
				        	}
		        		}
		        	}else{//읍내면 , 북극
		        		temp=temp.select('div.wrap_place').select('div.wrap_cont').toArray(); // 다음에서 해당하는 곳의 주소를 가져옴
			        	var i = 0;
			        	var name = temp.map(v=>(1+i++)+". "+v.select('a').first().text().replace(' 펼치기/접기',''));// want로 daum에 검색한 곳들의 이름들
			        	if(name.length == 0){
			        		r.replier.reply("검색이 불가능합니다.");
			        		return;
			        	}
			        	var loc = temp.map(v=>{vv=String(v.select('dd.cont').text()+' ');return vv.substr(0,vv.lastIndexOf("면 ")+1)});
			        	var loc1 = temp.map(v=>{vv=String(v.select('dd.cont').text()+' ');return vv.substr(0,vv.lastIndexOf("읍 ")+1)});
			        	var loc2 = temp.map(v=>{vv=String(v.select('dd.cont').text()+' ');return vv.substr(0,vv.lastIndexOf("동 ")+1)});  //각 이름들의 주소
			        	var loc3 = temp.map(v=>{vv=String(v.select('dd.cont').text()+' ');return vv.substr(0,vv.lastIndexOf("가 ")+1)});
			        	var msg;
			        	r.replier.reply("장소를 선택하세요\n"+name.join("\n"));
			        	msg=input.getMsg()*1;
			        	if(!isNaN(msg) && msg>=1 && msg<=name.length ){
			        		var targetNum=msg-1;
			        		var wantplace="";
			        		if( loc[targetNum].length > 0){
			        			wantplace=loc[targetNum];
			        		} else if (loc1[targetNum].length > 0){
			        			wantplace = loc1[targetNum];
			        		} else if(loc2[targetNum].length > 0){
			        			wantplace = loc2[targetNum];
			        		} else if(loc3[targetNum].length > 0){
			        			wantplace = loc3[targetNum];
			        		}
			        		link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨+"+wantplace).get();
			        		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
			        		if(link2.indexOf('regionCode')==-1){
			        			link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=+"+wantplace+"날씨").get();
				        		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
			        		}
			        		where = name[targetNum].substr(3) ;
			        		check = link2.indexOf('weather');
			        	}
		        	}
				} else if (link2 == 'http://m.weather.naver.com/m/nation.nhn') { // 바로 검색이 안될 때 2 ex) 독도, 죽림리
					var temp = org.jsoup.Jsoup.connect("https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q="+want).get();
					if(String(temp).indexOf('addressColl') > -1){
						var name = [];
		        		name.push('1. '+temp.select('div.mg_cont.clear.admin_area').select('div.wrap_tit').select('span').text());
		        		var i = 1;
		        		name = name.concat(temp.select('div.mg_cont.clear.admin_area').select('div.wrap_relspace').select('a').toArray().map(v=>(1+i++)+". "+v.text()));
		        		if(name.length==1){
		        			var targetNum=0;
		        		}else if (name.length>1){
		        			var msg;
				        	r.replier.reply("장소를 선택하세요\n"+name.join("\n"));
				        	msg=input.getMsg()*1;
				        	if(!isNaN(msg) && msg>=1 && msg<=name.length){
				        		var targetNum=msg-1;
				        	}
		        		}
		        		var wantplace="";
		        		var temp = name[targetNum].split('. ')[1];
			        	var loc = temp.substr(0, temp.lastIndexOf("면 ")+1);
			        	var loc1 = temp.substr(0, temp.lastIndexOf("읍 ")+1);
			        	var loc2 = temp.substr(0, temp.lastIndexOf("동 ")+1);  //각 이름들의 주소
			        	var loc3 = temp.substr(0, temp.lastIndexOf("가 ")+1);
			        	if( loc.length > 0){
		        			wantplace=loc;
		        		} else if (loc1.length > 0){
		        			wantplace = loc1;
		        		} else if(loc2.length > 0){
		        			wantplace = loc2;
		        		} else if(loc3.length > 0){
		        			wantplace = loc3;
		        		}
			        	link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨+"+wantplace).get();
			        	link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
			        	if(link2.indexOf('regionCode')==-1){
		        			link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=+"+wantplace+"날씨").get();
			        		link2 = link1.select('div.api_more_wrap').select('a').attr("abs:href");
		        		}
			        	check = link2.indexOf('weather');
			        	where = name[targetNum].split('. ')[1];
			        	if(check == -1 || String(temp).length == 0){
		        			r.replier.reply("검색이 불가능합니다.");
							return;
		        		}
	        		}
		        } else if(link2=="http://m.weather.naver.com"){//도단위 검색일 때 ex) 제주도 , 경남
					var i = 0;
	    			var name = link1.select('div.lcl_lst').select('span.lcl_name').toArray().map(v=>(1+i++)+". "+v.text());
	    			var msg;
	    			r.replier.reply("지역을 선택하세요\n"+name.join('\n'));
		        	msg=input.getMsg()*1;
		        	if(!isNaN(msg) && msg >= 1 && msg <= name.length){
		        		var targetNum=msg-1;
		        		link1 = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨+"+want).get();
		        		link2 = org.jsoup.Jsoup.connect(link1.select('div.lcl_lst').select('a').get(targetNum).attr("abs:href")).get().select('div.api_more_wrap').select('a').attr("abs:href");
		        		check = link2.indexOf('weather');
		        		where = name[targetNum].substr(3) ;
		        	}
		        }
			}
			
			if(link2.indexOf('regionCode')==-1){
				r.replier.reply("검색이 불가능합니다.");
        		return;
			}

			
			if(check > -1){
				var doc = org.jsoup.Jsoup.connect(link2).get();
				var sky = doc.select('div.weather_icon.sp_icon_60').toArray().map(v=> v.text());
				var degree = doc.select('div._cnWtrHourlyChartData').select('div[data-tab=0]').text().split(',').slice();
				var rain = doc.select('div._cnWtrHourlyChartData').select('div[data-tab=1]').text().split(',').slice();
				var wind = doc.select('div._cnWtrHourlyChartData').select('div[data-tab=2]').text().split(',').slice();
				var wet = doc.select('div._cnWtrHourlyChartData').select('div[data-tab=3]').text().split(',').slice();
				//var direction = doc.select('tr.row.row_icon._cnWtrHourlyChart[data-tab=2]').text().split(' ').slice();
				
				var where1 = "";
				if(want.length > 0 ){
					var where1 = "("+doc.select('div.section_location').select('strong').text()+")";
				}
				if( String(doc).indexOf('Weathernews') > 0 || String(doc).indexOf('The Weather Channel') > 0 || String(doc).indexOf('accuweather') > 0){
					var clock = doc.select("span.th_text").text().match(/[0123456789]?[0123456789](?=시)/g);
					var clock1 = clock.length;
					if (clock1 > 16){
						clock1 = 16;
					}
					var res =where+where1+" 날씨\n";
					res += "-------------날씨-------------\n"
						res += "시간 기온 강수 습도 바람    날씨\n [h]   [℃]  [%]  [%]  [㎧]    상태\n";
						for (var i = 1 ; i < clock1 ; i++) {
							res += " "+String(clock[i]).extension("0",2)+"    ";
							res += String(degree[i]).extension(" ",2)+"    ";
							res += String(rain[i]).extension(" ",2)+"   ";
							res += String(wet[i]).extension(" ", 2)+"   ";
							res += String(wind[i]).extension(" ",2)+" ";
							res += String(sky[i]).extension("ㅤ",5)+"\n";
							//res += String(direction[i]).extension("   ",3)+" ";
							if(i==5){
								res +=es;
							}
						}
						res += "\n"+link2;
				} else {
					var clock = doc.select("span.th_text").text().match(/[0123456789]?[0123456789](?=시)/g);
					var clock1 = clock.length;
					var uv1 = doc.select('li.uv').select('em').text();
					var uv = doc.select('li.uv').select('span').text().replace(uv1, " ("+uv1+")");
					var index = doc.select('strong.title').text().replace('최근 검색한 곳','').split(' ').map(v=>String(v).replace(/온도/g, "온도 : ").replace(/지수/g, "지수 : "))
					var sun1 = doc.select('li.sun_item').select('div.day').select('span').get(0).text() +" : "+ doc.select('li.sun_item').select('div.time').get(0).text();
					var sun2 = doc.select('li.sun_item').select('div.day').select('span').get(1).text() +" : "+ doc.select('li.sun_item').select('div.time').get(1).text();
					var link3 = link2+'&default=air';
					var doc1 = org.jsoup.Jsoup.connect(link3).get();
					var pollution = doc1.select('li.pollution_item').toArray().map(v=>{vv=String(v.select('span.number').select('em').text()); vvv=String(v.select('span.title').text()); return vvv +" : "+ v.select('span.number').text().replace(vv, " "+vv)});
					var dust = doc1.select('div.chart_item').toArray().map(v=>v.select('div.dust_graph_number').text().replace('먼지', '먼지 :')+"㎍/㎥" + "("+v.select('div.dust_graph_text').text()+")");
					if(sky.slice(0,7).map(v=>String(v)).indexOf("비") > -1 ){
						r.replier.reply('★비소식이 있습니다. 우산을 챙기세요★');
					}
					var res =where+where1+" 날씨\n"+"ㅤㅤ<종합정보 → 전체보기>\n";
					res += "-------미세먼지/자외선--------\n";
					res += dust.join("\n")+"\n";
					res += "자외선 : "+uv+"\n";
					res += "-------------날씨-------------\n"
					res += "시간ㅤ기상ㅤ기온 강수 습도 바람\n [h] ㅤ상황    [℃]  [%]  [%]  [㎧]\n";
					for (var i = 0 ; i < clock1 ; i++) {
						res += " "+String(clock[i]).extension("0",2)+" ";
						res += String(sky[i]).extensionRight("ㅤ",4)+"  ";
						res += String(degree[i]).extension(" ",2)+"   ";
						res += String(rain[i]).extension(" ",2)+"   ";
						res += String(wet[i]).extension(" ", 2)+"   ";
						res += String(wind[i]).extension(" ",2)+"\n";
						//res += String(direction[i]).extension("   ",3)+" ";
						if(i==6){
							res +=es;
						}
					}
					res += "------------기타지수------------\n"+pollution.join("\n")+"\n";
					res += "------------일상지수------------\n"+index.join("\n");
					res += "\n------------일출&일몰-----------\n"+sun1+"\n"+sun2;
					res += "\n"+link2;
				}
				r.replier.reply(res);
			}
		}catch(e){r.replier.reply(e+"\n"+e.stack)}
    })
}