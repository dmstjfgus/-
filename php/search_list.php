<?php

    $key = $_GET['key'];
    $n = $_GET['n'];

    $ch = curl_init();
    $url = 'http://openapi.kepco.co.kr/service/EvInfoServiceV2/getEvSearchList'; /*URL*/
    $queryParams = '?' . urlencode('serviceKey') . 
    '=B3xAD2Ck93FPbCmJPTuhYuSOZLrtbLBz0hZ5w5JVvwq7wAZP2jpuRIYQUkFrcRExXxZlp%2BQWeN5nObGl3RMvTg%3D%3D'; /*Service Key*/
    $queryParams .= '&' . urlencode('pageNo') . '=' . urlencode($n); /**/
    $queryParams .= '&' . urlencode('numOfRows') . '=' . urlencode('10'); /**/
    $queryParams .= '&' . urlencode('addr') . '=' . urlencode($key); /**/

    curl_setopt($ch, CURLOPT_URL, $url . $queryParams);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    $response = curl_exec($ch);
    curl_close($ch);

    // var_dump($response);
    // 참조 : https://www.delftstack.com/ko/howto/php/php-xml-to-json/
    $xml = simplexml_load_string($response); // xml 문자열화
    $json = json_encode($xml, JSON_UNESCAPED_UNICODE); // xml 문자열을 json으로 인코딩 / JSON_UNESCAPED_UNICODE = 한글 깨짐 방지
    echo $json; // json 출력

?>