WCC = T.register("weatherClockCheck",()=>{
	while(true){
		if( 7 == new Date().getHours() ){
			r={msg : '!날씨', room : '푸드마켓',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨', room : '시립대 전전컴 톡방',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨', room : '시립대 자취생 생정',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨', room : '시립대 단톡방',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨 공릉동', room : '단톡방',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨', room : '단톡방',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨 강북구 수유 1동', room : '단톡방',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨', room : '오버워치',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨 부산 대연동', room : '오버워치',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨 진해 석동', room : '오버워치',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(6*1000);
			r={msg : '!날씨 광주 오룡동', room : '오버워치',replier:{reply:function(msg){
				Api.replyRoom(r.room,msg)
				}}
			}
			weather(r);
			java.lang.Thread.sleep(60*60*1000);	//60분
		}
		java.lang.Thread.sleep(59*1000); //59초
	}
}).start();

NC = T.register("noticeCheck",()=>{
	while(true){
		java.lang.Thread.sleep(50*1000); //50초
		noticecheck();
	}
}).start();