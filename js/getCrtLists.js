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
          content: `<div class="marker-info">${items[i].csNm}</div>`,
          latlng: new kakao.maps.LatLng(items[i].lat, items[i].longi),
        });

        if (items[i].cpStat == "1") {
          imageSrc.push("/ev_charge/img/green.png");
        } else {
          imageSrc.push("/ev_charge/img/red.png");
        }
      }

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
        // console.log(positions[i].content);

        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
          content: positions[i].content, // 인포윈도우에 표시할 내용
        });

        // 각 마커의 제목을 말풍선으로 표시합니다.
        infowindow.open(map, marker);
      }

      // 말풍선 정보 스타일 수정
      const markerInfo = document.querySelectorAll(".marker-info");
      // console.log(markerInfo);
      markerInfo.forEach((info) => {
        info.parentNode.parentNode.style.background = "rgb(34, 36, 41)";
        info.parentNode.style.width = 100 + "%";
        info.parentNode.style.heigh = 100 + "%";
        info.parentNode.style.border = "white";
      });

      getLists(latitude, longitude, data);
    },
    error: function (e) {
      console.log(e);
    },
  });
}

function getLists(la, ln, d) {
  const parseJson = JSON.parse(d); // json 문자열을 json 데이터 형식으로 파싱
  const items = parseJson.body.items.item;
  // console.log(items);
  const itemList = document.querySelector(".item-list");
  let listsElmt;

  // 분리
  items.map((li) => {
    // console.log(li);

    let charTp, cpStat, statBg;
    if (li.charTp === "1") {
      charTp = "완속";
    } else {
      charTp = "급속";
    }

    if (li.cpStat === "1") {
      cpStat = "충전가능";
      statBg = "rgb(50,151,255)";
    } else if (li.cpStat === "2") {
      cpStat = "충전중";
      statBg = "rgb(210,145,188)";
    } else {
      cpStat = "오류(점검중)";
      statBg = "rgb(255,50,50)";
    }

    function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lng2 - lng1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }
    // console.log(
    //   getDistanceFromLatLonInKm(
    //     37.5552777,
    //     126.9198226,
    //     "37.56838316139128",
    //     "126.89494282897327"
    //   )
    // );

    listsElmt = `
      <div class="item">
        <p>${li.addr}</p>
        <div class="stats">
          <span style="background:${statBg}">상태 : ${cpStat}</span>
          <span>타입 : ${charTp}</span>
          <span>갱신 : ${li.statUpdateDatetime}</span>
          <span>거리 : ${getDistanceFromLatLonInKm(
            la,
            ln,
            li.lat,
            li.longi
          ).toFixed(2)}km</span>
        </div>
      </div>
    `;
    itemList.innerHTML += listsElmt;
  });
}
