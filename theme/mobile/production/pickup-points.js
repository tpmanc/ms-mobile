$(function(){function e(){var e=$("#pickupPointsCitySelector option:selected").data("center").split(",");l=[],l=$("#pickupPointsCitySelector option:selected").data("adresses").split("&");var a=$("#pickupPointsCitySelector option:selected").data("zoom");o=new ymaps.Map("mapHolder",{center:[55.76,37.64],zoom:7,controls:["smallMapDefaultSet"]}),o.behaviors.disable("scrollZoom"),s=new ymaps.GeoObjectCollection,t(l),o.setCenter(e),o.setZoom(a),o.geoObjects.events.add("click",function(e){var t=e.get("target"),o=t.properties.getAll();o=o.balloonContent;var a=$('#shops li:contains("'+o+'")');$("#shops").mCustomScrollbar("scrollTo",a),$("#shops li.active").removeClass("active"),$(a).addClass("active")})}function t(e){s.removeAll(),s=new ymaps.GeoObjectCollection;var t=[];$(l).each(function(e,o){""==o&&l.splice(e,1);var i;-1==o.indexOf("#")?i="blue":(i=o.substr(o.indexOf("#")+1),o=o.substr(0,o.indexOf("#")));var n=ymaps.geocode(l[e]);n.then(function(n){a=n.geoObjects.get(0).geometry.getCoordinates();var c=(ymaps.geocode(a,{kind:"house"}),$('#shops li:contains("'+o+'")')),r=c.html().indexOf("метро"),p=n.geoObjects.get(0).properties.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName");if(0>r&(o.indexOf("Москва")>=0||o.indexOf("Санкт-Петербург")>=0||o.indexOf("Нижний Новгород")>=0||o.indexOf("Новосибирск")>=0||o.indexOf("Самара")>=0||o.indexOf("Екатеринбург")>=0||o.indexOf("Казань")>=0)){var d=ymaps.geocode(a,{kind:"metro",resaults:1});d.then(function(o){var a=o.geoObjects.get(0),s=a.properties.get("name").replace("метро ","");if("станция канатной дороги Нижегородская"==s&&(s="Горьковская"),c.attr("data-metro",s),c.html(c.html()+"(метро "+s+")"),-1==$.inArray(s,t)&&t.push(s),e==l.length-1){t.sort();var i,n=p.replace(" ","");for(i="Москва"==p?'<p class="metro-select active" id="select-Москва"><select name="metro"><option selected value="all">Выберите станцию метро</option>':'<p class="metro-select" id="select-'+n+'"><select name="metro"><option selected value="all">Выберите станцию метро</option>',e=0;e<t.length;e++)i+='<option value="'+t[e]+'">'+t[e]+"</option>";i+="</select></p>",$("#metro-div").append(i),$("#select-"+n).addClass("active"),$("#select-"+n).change(function(){var e=$("#select-"+n+" option:selected").val();$("#shops ul.active li").hide(),"all"==e?$("#shops ul.active li").show():$("#shops ul.active li[data-metro='"+e+"']").show()})}})}s.add(new ymaps.Placemark(a,{balloonContent:o},{hideIconOnBalloonOpen:!0,preset:"twirl#Icon",iconColor:i}))})}),o.geoObjects.add(s)}ymaps.ready(e);var o,a,s,l=[]});