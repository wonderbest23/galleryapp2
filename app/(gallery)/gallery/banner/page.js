"use client";

import React, { useState } from "react";
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Image, Checkbox, Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

export default function Banner() {
  // 메인 배너 상태 관리
  const [mainBanners, setMainBanners] = useState({
    banner1: "",
    banner2: "",
    banner3: "",
    banner4: "",
    banner5: "",
  });

  // 이벤트 배너 상태 관리
  const [eventBanners, setEventBanners] = useState({
    banner1: "",
    banner2: "",
    banner3: "",
    banner4: "",
    banner5: "",
  });

  // 갤러리 관련 상태 관리
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryPage, setGalleryPage] = useState(1);
  const [selectedGalleries, setSelectedGalleries] = useState([]);
  const [galleries, setGalleries] = useState([
    { id: 1, title: "현대 미술 전시", image: "https://via.placeholder.com/300x200?text=현대+미술", featured: false },
    { id: 2, title: "자연 사진전", image: "https://via.placeholder.com/300x200?text=자연+사진전", featured: true },
    { id: 3, title: "추상화 전시회", image: "https://via.placeholder.com/300x200?text=추상화", featured: false },
    { id: 4, title: "조각 작품 전시", image: "https://via.placeholder.com/300x200?text=조각+작품", featured: false },
    { id: 5, title: "디지털 아트 전시", image: "https://via.placeholder.com/300x200?text=디지털+아트", featured: true },
    { id: 6, title: "사진 작가 특별전", image: "https://via.placeholder.com/300x200?text=사진+작가", featured: false },
    { id: 7, title: "전통 예술 전시회", image: "https://via.placeholder.com/300x200?text=전통+예술", featured: false },
    { id: 8, title: "현대 조형물 전시", image: "https://via.placeholder.com/300x200?text=현대+조형물", featured: false },
  ]);

  // 전시회 관련 상태 관리
  const [exhibitionSearch, setExhibitionSearch] = useState("");
  const [exhibitionPage, setExhibitionPage] = useState(1);
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);
  const [exhibitions, setExhibitions] = useState([
    { id: 1, title: "봄 특별 전시회", date: "2024-04-01 ~ 2024-04-30", location: "서울 미술관", featured: true },
    { id: 2, title: "국제 미술 페스티벌", date: "2024-05-15 ~ 2024-06-15", location: "부산 전시관", featured: false },
    { id: 3, title: "젊은 작가 특별전", date: "2024-06-01 ~ 2024-06-30", location: "대구 아트센터", featured: false },
    { id: 4, title: "여름 기획 전시", date: "2024-07-10 ~ 2024-08-10", location: "인천 갤러리", featured: true },
    { id: 5, title: "디자인 트렌드 전시", date: "2024-08-20 ~ 2024-09-20", location: "광주 전시장", featured: false },
    { id: 6, title: "가을 미술 축제", date: "2024-09-15 ~ 2024-10-15", location: "제주 아트플렉스", featured: false },
    { id: 7, title: "해외 작가 초청전", date: "2024-10-01 ~ 2024-11-01", location: "대전 아트센터", featured: false },
    { id: 8, title: "연말 특별 전시회", date: "2024-12-01 ~ 2024-12-31", location: "서울 갤러리", featured: true },
  ]);

  // 메인 배너 URL 업데이트 핸들러
  const handleMainBannerChange = (e, bannerKey) => {
    setMainBanners({
      ...mainBanners,
      [bannerKey]: e.target.value,
    });
  };

  // 이벤트 배너 URL 업데이트 핸들러
  const handleEventBannerChange = (e, bannerKey) => {
    setEventBanners({
      ...eventBanners,
      [bannerKey]: e.target.value,
    });
  };

  // 메인 배너 저장 핸들러
  const saveMainBanners = () => {
    console.log("메인 배너 저장:", mainBanners);
    // 여기에 API 호출 또는 저장 로직을 추가
    alert("메인 배너가 저장되었습니다.");
  };

  // 이벤트 배너 저장 핸들러
  const saveEventBanners = () => {
    console.log("이벤트 배너 저장:", eventBanners);
    // 여기에 API 호출 또는 저장 로직을 추가
    alert("이벤트 배너가 저장되었습니다.");
  };

  // 갤러리 검색 핸들러
  const handleGallerySearch = (e) => {
    setGallerySearch(e.target.value);
    setGalleryPage(1);
  };

  // 전시회 검색 핸들러
  const handleExhibitionSearch = (e) => {
    setExhibitionSearch(e.target.value);
    setExhibitionPage(1);
  };

  // 갤러리 체크 핸들러
  const toggleGalleryFeature = (id) => {
    setGalleries(galleries.map(gallery => 
      gallery.id === id ? { ...gallery, featured: !gallery.featured } : gallery
    ));
  };

  // 전시회 체크 핸들러
  const toggleExhibitionFeature = (id) => {
    setExhibitions(exhibitions.map(exhibition => 
      exhibition.id === id ? { ...exhibition, featured: !exhibition.featured } : exhibition
    ));
  };

  // 필터링된 갤러리 목록
  const filteredGalleries = galleries.filter(gallery => 
    gallery.title.toLowerCase().includes(gallerySearch.toLowerCase())
  );

  // 필터링된 전시회 목록
  const filteredExhibitions = exhibitions.filter(exhibition => 
    exhibition.title.toLowerCase().includes(exhibitionSearch.toLowerCase())
  );

  // 갤러리 저장 핸들러
  const saveGalleryFeatures = () => {
    console.log("상단 노출 갤러리:", galleries.filter(gallery => gallery.featured));
    alert("갤러리 상단 노출 설정이 저장되었습니다.");
  };

  // 전시회 저장 핸들러
  const saveExhibitionFeatures = () => {
    console.log("상단 노출 전시회:", exhibitions.filter(exhibition => exhibition.featured));
    alert("전시회 상단 노출 설정이 저장되었습니다.");
  };

  // 페이지당 아이템 수
  const itemsPerPage = 4;

  // 현재 페이지의 갤러리 데이터
  const currentGalleries = filteredGalleries.slice(
    (galleryPage - 1) * itemsPerPage,
    galleryPage * itemsPerPage
  );

  // 현재 페이지의 전시회 데이터
  const currentExhibitions = filteredExhibitions.slice(
    (exhibitionPage - 1) * itemsPerPage,
    exhibitionPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">배너 관리</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* 메인 배너 섹션 */}
        <Card 
          shadow="sm" 
          radius="lg" 
          className="max-w-full col-span-2 md:col-span-1"
        >
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-xl font-semibold">메인 배너 관리</p>
              <p className="text-small text-default-500">메인 화면에 표시될 배너를 관리합니다</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.keys(mainBanners).map((key, index) => (
                <div key={key} className="flex flex-col">
                  <label className="mb-1 font-medium">메인 배너 {index + 1}</label>
                  <Input
                    type="text"
                    value={mainBanners[key]}
                    onChange={(e) => handleMainBannerChange(e, key)}
                    placeholder="배너 이미지 URL을 입력하세요"
                    radius="sm"
                    classNames={{
                      input: "text-small",
                      inputWrapper: "border-1"
                    }}
                  />
                  {mainBanners[key] && (
                    <div className="mt-2 rounded-md overflow-hidden h-24">
                      <Image
                        src={mainBanners[key]} 
                        alt={`메인 배너 ${index + 1} 미리보기`} 
                        className="w-full h-full object-cover"
                        fallback="https://via.placeholder.com/300x100?text=배너+이미지+미리보기"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter>
            <Button
              onPress={saveMainBanners}
              color="primary"
              radius="sm"
              className="w-full"
            >
              메인 배너 저장하기
            </Button>
          </CardFooter>
        </Card>
        
        {/* 이벤트 배너 섹션 */}
        <Card 
          shadow="sm" 
          radius="lg" 
          className="max-w-full col-span-2 md:col-span-1"
        >
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-xl font-semibold">이벤트 배너 관리</p>
              <p className="text-small text-default-500">이벤트 페이지에 표시될 배너를 관리합니다</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.keys(eventBanners).map((key, index) => (
                <div key={key} className="flex flex-col">
                  <label className="mb-1 font-medium">이벤트 배너 {index + 1}</label>
                  <Input
                    type="text"
                    value={eventBanners[key]}
                    onChange={(e) => handleEventBannerChange(e, key)}
                    placeholder="배너 이미지 URL을 입력하세요"
                    radius="sm"
                    classNames={{
                      input: "text-small",
                      inputWrapper: "border-1"
                    }}
                  />
                  {eventBanners[key] && (
                    <div className="mt-2 rounded-md overflow-hidden h-24">
                      <Image
                        src={eventBanners[key]} 
                        alt={`이벤트 배너 ${index + 1} 미리보기`} 
                        className="w-full h-full object-cover"
                        fallback="https://via.placeholder.com/300x100?text=배너+이미지+미리보기"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter>
            <Button
              onPress={saveEventBanners}
              color="secondary"
              radius="sm"
              className="w-full"
            >
              이벤트 배너 저장하기
            </Button>
          </CardFooter>
        </Card>
        
        {/* 갤러리 관리 섹션 */}
        <Card 
          shadow="md" 
          radius="lg" 
          className="max-w-full col-span-2 md:col-span-1"
        >
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-xl font-semibold">갤러리 상단 노출 관리</p>
              <p className="text-small text-default-500">메인 페이지에 상단 노출할 갤러리를 선택합니다</p>
            </div>
          </CardHeader>
          <CardBody>
            <Input
              type="text"
              value={gallerySearch}
              onChange={handleGallerySearch}
              placeholder="갤러리 검색어를 입력하세요"
              radius="sm"
              className="mb-4"
              classNames={{
                input: "text-small",
                inputWrapper: "border-1"
              }}
            />
            
            <Table 
              aria-label="갤러리 목록"
              selectionMode="multiple"
              selectionBehavior="replace"
              className="mb-4"
              shadow="none"
              classNames={{wrapper: "p-0"}}
            >
              <TableHeader>
                <TableColumn width={70}>노출</TableColumn>
                <TableColumn>갤러리명</TableColumn>
                <TableColumn width={120}>미리보기</TableColumn>
              </TableHeader>
              <TableBody>
                {currentGalleries.map((gallery) => (
                  <TableRow key={gallery.id}>
                    <TableCell>
                      <Checkbox
                        isSelected={gallery.featured}
                        onValueChange={() => toggleGalleryFeature(gallery.id)}
                      />
                    </TableCell>
                    <TableCell>{gallery.title}</TableCell>
                    <TableCell>
                      <Image
                        src={gallery.image}
                        alt={gallery.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center">
              <Pagination
                total={Math.ceil(filteredGalleries.length / itemsPerPage)}
                page={galleryPage}
                onChange={setGalleryPage}
              />
            </div>
          </CardBody>
          <CardFooter>
            <Button
              onPress={saveGalleryFeatures}
              color="primary"
              radius="sm"
              className="w-full"
            >
              갤러리 상단 노출 저장하기
            </Button>
          </CardFooter>
        </Card>
        
        {/* 전시회 관리 섹션 */}
        <Card 
          shadow="md" 
          radius="lg" 
          className="max-w-full col-span-2 md:col-span-1"
        >
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-xl font-semibold">전시회 상단 노출 관리</p>
              <p className="text-small text-default-500">메인 페이지에 상단 노출할 전시회를 선택합니다</p>
            </div>
          </CardHeader>
          <CardBody>
            <Input
              type="text"
              value={exhibitionSearch}
              onChange={handleExhibitionSearch}
              placeholder="전시회 검색어를 입력하세요"
              radius="sm"
              className="mb-4"
              classNames={{
                input: "text-small",
                inputWrapper: "border-1"
              }}
            />
            
            <Table 
              aria-label="전시회 목록"
              selectionMode="multiple"
              selectionBehavior="replace"
              className="mb-4"
              shadow="none"
              classNames={{wrapper: "p-0"}}
            >
              <TableHeader>
                <TableColumn width={70}>노출</TableColumn>
                <TableColumn>전시회명</TableColumn>
                <TableColumn>날짜</TableColumn>
                <TableColumn>장소</TableColumn>
              </TableHeader>
              <TableBody>
                {currentExhibitions.map((exhibition) => (
                  <TableRow key={exhibition.id}>
                    <TableCell>
                      <Checkbox
                        isSelected={exhibition.featured}
                        onValueChange={() => toggleExhibitionFeature(exhibition.id)}
                      />
                    </TableCell>
                    <TableCell>{exhibition.title}</TableCell>
                    <TableCell>{exhibition.date}</TableCell>
                    <TableCell>{exhibition.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center">
              <Pagination
                total={Math.ceil(filteredExhibitions.length / itemsPerPage)}
                page={exhibitionPage}
                onChange={setExhibitionPage}
              />
            </div>
          </CardBody>
          <CardFooter>
            <Button
              onPress={saveExhibitionFeatures}
              color="secondary"
              radius="sm"
              className="w-full"
            >
              전시회 상단 노출 저장하기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


