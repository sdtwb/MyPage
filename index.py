#coding=utf-8
import eel
import json
import requests
from translate import Translator
from bs4 import BeautifulSoup

eel.init('web')

# 爬取微博热搜
@eel.expose
def weibo_hot_search():
	weibo_url= "https://s.weibo.com/top/summary?cate=realtimehot" 
	html= requests.get(weibo_url)

	soup= BeautifulSoup(html.text, "html.parser")
	table_hot= soup.find("div", id= "pl_top_realtimehot").find("table")

	# 热搜和热搜链接
	links= table_hot.find_all('a')
	link_text= []
	for top in links:
		link_text.append(top['href'])
		link_text.append(top.text)
	return link_text

@eel.expose
def background_img():
	url_api= "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
	json_str= requests.get(url_api)
	json_res= json.loads(json_str.text)

	url_bing= "https://cn.bing.com"
	url_img= url_bing+ json_res["images"][0]["url"]
	# print(url_img)
	return url_img

def get_location():
	#还可使用 http://ip.42.pl/raw、https://jsonip.com/、https://api.ipify.org/?format=json、http://httpbin.org/ip
	# https://ipv4.jsonip.com、http://ipv4.icanhazip.com/、https://api.myip.com、http://tool.nanguoyu.us/ip.php
	url_api_getip= "http://tool.nanguoyu.us/ip.php"
	res= requests.get(url_api_getip)
	ip= res.text
	# ip= json.loads(ip)
	# ip= ip["ip"]

	# print(ip)
	url_ip_api= "http://freeapi.ipip.net/"+ ip
	res= requests.get(url_ip_api)
	res= json.loads(res.text)
	# print(res[2])
	return res[2]

@eel.expose
def weather():
	translator= Translator(from_lang="chinese", to_lang="english")
	translation= translator.translate(get_location())
	# print(translation)

	# 天气查询--openWeatherMap
	# refer to https://openweathermap.org/api
	url_api= "http://api.openweathermap.org/data/2.5/weather?lang=zh_cn&units=metric"
	appid= "37127bd7576609e7bd24f267729cd24d"
	q= translation
	url_api+= "&q="+ q+ "&APPID="+ appid
	json_str= requests.get(url_api)

	# print(json_str.text)
	return json_str.text

@eel.expose
def words_everyday():
	# api首页https://hitokoto.cn/api
	url_api= "https://v1.hitokoto.cn/"
	res= requests.get(url_api)
	return res.text

eel.start("index.html", mode= 'edge', port= 8087)

# python调试
if __name__== '__main__':
	# weibo_hot_search()
	# background_img()
	weather()
	# get_location()