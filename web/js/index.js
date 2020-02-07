function getTime(){
	// 更新时间
	str = ""
	var p = document.getElementById("time_now");
	time =  new Date();
	year = time.getFullYear();
	month = time.getMonth() + 1;
	day = time.getDate();
	hour = time.getHours();
	minutes = time.getMinutes();
	seconds = time.getSeconds();
	str = str + year +"-"+ month +"-"+ day + " " +hour+":"+minutes+":"+seconds;
	
	p.innerText = str;
 
	setTimeout(getTime,1000);
}

function checkMouse(ele){
	// 监听鼠标事件
	var class_name= ele.className;
	// alert(class_name)
	if(class_name== "weibo_hot"){
		var weibo_hot= document.getElementById("weibo_hot");
		weibo_hot.style.display= weibo_hot.style.display=="block"?"none": "block";
	}

	if(class_name== "weather"){
		var weibo_hot= document.getElementById("weather");
		weibo_hot.style.display= weibo_hot.style.display=="block"?"none": "block";
		var weibo_desc= document.getElementById("weather_desc");
		weibo_desc.style.display= weibo_desc.style.display=="none"?"block": "none";
	}
}
async function weather(){
	// 利用openWeatherMap的weather api获取地址天气情况
	var weather_res_str= await eel.weather()()
	weather_res= JSON.parse(weather_res_str)

	var name= weather_res["name"]
	var temp_now= weather_res["main"]["temp"]+ "℃"
	var feels_like= weather_res["main"]["feels_like"]+ "℃"
	var temp_min= weather_res["main"]["temp_min"]+ "℃"
	var temp_max= weather_res["main"]["temp_max"]+ "℃"
	var humidity= weather_res["main"]["humidity"]+ "%"
	var clouds= weather_res["clouds"]["all"]+ "%"

	var weather_id= document.getElementById("weather");
	weather_id.innerHTML= "<div><h4>"+ name+ "</h4>"
		+"<h5>temp:"+ temp_now+ " feels_like:"+ feels_like+  " humidity:"+ humidity
		+" temp_min/max:"+ temp_min+ "/"+ temp_max+" clouds:"+ clouds+ "</h5></div>"

	setTimeout(weather, 5*60*1000);
}
async function weibo_hot_search(){
	// 利用爬虫爬取微博热搜
	var weibo_url= "https://s.weibo.com";
    var weibo_hot= document.getElementById("weibo_hot");
	var hot_result= await eel.weibo_hot_search()();
	
	weibo_hot_str= "<table>";
	for(var i= 0; i< hot_result.length; ){
		if(i%6== 0)
			weibo_hot_str+= "<tr>";
		weibo_hot_str+= " <td><a href= '"
		weibo_hot_str+= weibo_url+ hot_result[i++];
		weibo_hot_str+= "' target='_blank'>";
		weibo_hot_str+= parseInt(i/2) + "、"+ hot_result[i++];
		weibo_hot_str+= "</a></td>";
		if(i%6== 0)
			weibo_hot_str+= " </tr>";
	}
	weibo_hot_str+= "</table>";
	weibo_hot.innerHTML= weibo_hot_str;
	setTimeout(weibo_hot_search, 60*1000);
}
async function change_background_img(){
	// 利用bing每日一图更换背景图片
	var body= document.getElementById("body")
	var background_img= await eel.background_img()()

	body.style.backgroundImage= "url('"+ background_img+ "')"
	// 两个小时更新一次
	setTimeout(change_background_img, 1000*60*60* 2)
}
async function words_everyday(){
	var words_everyday= document.getElementById("words_everyday")
	var words_everyday_str= await eel.words_everyday()()

	var words= JSON.parse(words_everyday_str)
	hitokoto= words["hitokoto"]
	from_where= words["from"]
	words_everyday.innerHTML= hitokoto+ "--"+ from_where
	setTimeout(words_everyday, 1000*60*60)
}
window.onload = function(){
	this.change_background_img();
	this.getTime();
	this.words_everyday();
	this.weibo_hot_search();
	this.weather();
}