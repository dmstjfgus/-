const keyParam = document.location.href.split("=")[1];
const decordParam = decodeURI(keyParam);

function getCrtLists(latitude, longitude) {
  console.log(latitude);
  console.log(longitude);
  $.ajax({
    url: `/ev_charge/php/search_list.php?key=${decordParam}`, // 요청 엔드포인트
    type: "GET", // 요청 방식
    success: function (data) {
      const parseJson = JSON.parse(data); // json 문자열을 json 데이터 형식으로 파싱
      const items = parseJson.body.items.item;
      console.log(items);

      // 지도 마커 표시
      var mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(items[0].lat, items[0].longi), // 지도의 중심좌표
          level: 8, // 지도의 확대 레벨
        };

      var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      var positions = [];
      var imageSrc = [];
      for (let i = 0; i < items.length; i++) {
        positions.push({
          latlng: new kakao.maps.LatLng(items[i].lat, items[i].longi),
        });

        if (items[i].cpStat == "1") {
          imageSrc.push("/ev_charge/img/green.png");
        } else {
          imageSrc.push("/ev_charge/img/red.png");
        }
      }

      console.log(imageSrc);

      // 마커 이미지의 이미지 주소입니다
      // var imageSrc = "/ev_charge/img/green.png";

      for (var i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc[i], imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i].latlng, // 마커를 표시할 위치
          title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });
      }
    },
    error: function (e) {
      console.log(e);
    },
  });
}
