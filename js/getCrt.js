var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;
  //좌표를 알아낼 수 있는데, 여기서 알아낸 좌표를 kakaoAPI url에 사용할 것이다.
  //   console.log("위도 : " + position.coords.latitude);
  //   console.log("경도 : " + position.coords.longitude);
  lat = crd.latitude;
  lon = crd.longitude;
  console.log(lat);
  console.log(lon);

  getCrtNm(lat, lon);
}

function error(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}

navigator.geolocation.getCurrentPosition(success, error, options);

function getCrtNm(latitude, longitude) {
  $.ajax({
    url:
      "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=" +
      longitude +
      "&y=" +
      latitude, // 요청 엔드포인트
    type: "GET", // 요청 방식
    headers: {
      Authorization: "KakaoAK ab55cd18a1b0a8d524cbd8490c92a075", // 승인 rest api key
    },
    success: function (data) {
      console.log(data.documents[0].address.region_2depth_name);
      $(".crt-gu").text(data.documents[0].address.region_2depth_name);
    },
    error: function (e) {
      console.log(e);
    },
  });
}
