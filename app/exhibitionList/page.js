"use client";
import React, { Suspense } from "react";
import { ExhibitionCards } from "./components/exhibition-cards";
import {
  Tabs,
  Tab,
  Button,
  Select,
  SelectItem,
  Spinner,
  Checkbox,
  addToast,
  Skeleton
} from "@heroui/react";
import { FaChevronLeft, FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaPlusCircle } from "react-icons/fa";

// useSearchParams를 사용하는 별도의 클라이언트 컴포넌트
function ExhibitionListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIsBookmark =
    searchParams.get("isBookmark") === "true" ||
    searchParams.get("isBookmark") === "1";
  const [selectedTab, setSelectedTab] = useState("all");
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isBookmark, setIsBookmark] = useState(initialIsBookmark);
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // 북마크 필터 상태가 변경될 때마다 전시회 목록 초기화 및 다시 불러오기
    setPage(1);
    setExhibitions([]);
    // 데이터를 즉시 다시 불러오기 위해 useEffect 의존성 배열에 isBookmark 추가됨
  }, [selectedTab, isBookmark, selectedRegion]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      setLoading(true);

      try {
        console.log("fetchExhibitions 실행:", {
          isBookmark,
          userExists: !!user,
          bookmarksLength: bookmarks.length,
          loadingBookmarks,
        });

        // 북마크 필터가 활성화되어 있지만 사용자가 로그인하지 않은 경우
        if (isBookmark && !user) {
          console.log("북마크 필터 활성화됨, 로그인 필요");
          setExhibitions([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        // 북마크 필터가 활성화되어 있고 사용자가 로그인했지만 북마크 데이터가 아직 로드 중인 경우
        if (isBookmark && user && loadingBookmarks) {
          console.log("북마크 데이터 로딩 중, 대기");
          return; // 북마크 데이터가 로드될 때까지 대기
        }

        let query = supabase
          .from("exhibition")
          .select("*,gallery:naver_gallery_url(*)")
          .not("gallery", "is", null);

        // 선택된 탭에 따라 필터 적용
        if (selectedTab === "free") {
          query = query.eq("isFree", true);
        } else if (selectedTab === "recommended") {
          query = query.eq("isRecommended", true);
        }

        // 지역 필터 적용
        if (selectedRegion) {
          query = query.ilike("gallery.address", `%${selectedRegion}%`);
        }

        // 북마크 필터 적용
        if (isBookmark && user) {
          console.log("북마크 필터링 적용");

          // null이 아닌 유효한 exhibition_id만 필터링
          const bookmarkedIds = bookmarks
            .filter((b) => b.exhibition_id !== null)
            .map((b) => b.exhibition_id);

          console.log("북마크된 전시회 ID:", bookmarkedIds);

          if (bookmarkedIds.length === 0) {
            // 북마크가 없거나 모두 null인 경우 빈 결과 반환
            console.log("북마크된 전시회 없음");
            setExhibitions([]);
            setHasMore(false);
            setLoading(false);
            return;
          }

          query = query.in("id", bookmarkedIds);
        }

        const { data, error } = await query.range((page - 1) * 5, page * 5 - 1);

        if (error) throw error;

        console.log("가져온 전시회 데이터:", data.length);

        if (page === 1) {
          setExhibitions(data);
        } else {
          setExhibitions((prevExhibitions) => [...prevExhibitions, ...data]);
        }

        setHasMore(data.length === 5);
      } catch (error) {
        console.error("전시회 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, [
    page,
    selectedTab,
    selectedRegion,
    isBookmark,
    bookmarks,
    user,
    loadingBookmarks,
  ]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    fetchUser();
  }, []);

  // 사용자의 북마크 목록 가져오기
  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      setLoadingBookmarks(true);
      console.log("북마크 데이터 로드 중...");

      const { data, error } = await supabase
        .from("bookmark")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      console.log("북마크 데이터 로드 완료:", data?.length || 0);
      setBookmarks(data || []);
    } catch (error) {
      console.error("북마크 로드 에러:", error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  // 북마크 상태 확인하는 함수
  const isBookmarked = (exhibitionId) => {
    return bookmarks.some(
      (bookmark) => bookmark.exhibition_id === exhibitionId
    );
  };

  // 북마크 토글 함수
  const toggleBookmark = async (e, exhibition) => {
    e.preventDefault(); // 링크 이벤트 방지
    e.stopPropagation(); // 이벤트 버블링 방지

    if (!user) {
      // 사용자가 로그인하지 않은 경우 처리
      alert("북마크를 추가하려면 로그인이 필요합니다.");
      return;
    }

    const isCurrentlyBookmarked = isBookmarked(exhibition.id);

    try {
      if (isCurrentlyBookmarked) {
        // 북마크 삭제
        const { error } = await supabase
          .from("bookmark")
          .delete()
          .eq("user_id", user.id)
          .eq("exhibition_id", exhibition.id);

        if (error) throw error;

        // 북마크 목록에서 제거
        setBookmarks(
          bookmarks.filter(
            (bookmark) => bookmark.exhibition_id !== exhibition.id
          )
        );

        // 북마크 삭제 토스트 표시
        addToast({
          title: "북마크 삭제",
          description: `${exhibition.name} 북마크가 삭제되었습니다.`,
          color: "danger",
        });
      } else {
        // 북마크 추가
        const { data, error } = await supabase
          .from("bookmark")
          .insert({
            user_id: user.id,
            exhibition_id: exhibition.id,
            created_at: new Date().toISOString(),
          })
          .select();

        if (error) throw error;

        // 북마크 목록에 추가
        setBookmarks([...bookmarks, data[0]]);

        // 북마크 추가 토스트 표시
        addToast({
          title: "북마크 추가",
          description: `${exhibition.name} 북마크에 추가되었습니다.`,
          color: "success",
        });
      }
    } catch (error) {
      console.error("북마크 토글 에러:", error);

      // 에러 토스트 표시
      addToast({
        title: "오류 발생",
        description: "북마크 처리 중 오류가 발생했습니다.",
        color: "danger",
        variant: "solid",
        timeout: 3000,
      });
    }
  };

  // 컴포넌트 마운트 시 북마크 로드
  useEffect(() => {
    if (user) {
      console.log("사용자 로그인 확인됨, 북마크 로드 시작");
      fetchBookmarks();
    }
  }, [user]);

  // URL 매개변수 업데이트 함수
  const updateBookmarkUrlParam = (isBookmarked) => {
    const url = new URL(window.location);
    if (isBookmarked) {
      url.searchParams.set("isBookmark", "true");
    } else {
      url.searchParams.delete("isBookmark");
    }
    window.history.pushState({}, "", url);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-6 mt-12">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="max-w-[300px] w-full flex items-center gap-3"
              >
                <div>
                  <Skeleton className="flex rounded-full w-12 h-12" />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <>
          <div className="bg-white flex items-center w-[90vw] justify-between">
            <Button
              isIconOnly
              variant="light"
              className="mr-2"
              onPress={() => router.push("/")}
            >
              <FaChevronLeft className="text-xl" />
            </Button>
            <h2 className="text-lg font-bold text-center flex-grow">전시회</h2>
            <div className="w-10"></div>
          </div>

          <div className="flex justify-between items-center w-[90%] mb-4">
            <Checkbox
              color="primary"
              value={isBookmark}
              isSelected={isBookmark}
              onChange={(e) => {
                setIsBookmark(e.target.checked);
                updateBookmarkUrlParam(e.target.checked);
              }}
              size="md"
            >
              북마크
            </Checkbox>
            <Select
              selectedKeys={selectedRegion ? [selectedRegion] : []}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-1/3"
              placeholder="지역"
            >
              <SelectItem key="서울" value="서울">
                서울
              </SelectItem>
              <SelectItem key="인천" value="인천">
                인천
              </SelectItem>
              <SelectItem key="경기" value="경기">
                경기
              </SelectItem>
              <SelectItem key="충청" value="충청">
                충청
              </SelectItem>
              <SelectItem key="경상" value="경상">
                경상
              </SelectItem>
              <SelectItem key="전라" value="전라">
                전라
              </SelectItem>
              <SelectItem key="강원" value="강원">
                강원
              </SelectItem>
              <SelectItem key="제주" value="제주">
                제주
              </SelectItem>
            </Select>
          </div>
          <Tabs
            aria-label="Exhibition options"
            variant="underlined"
            className="w-full flex justify-center items-center"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
          >
            <Tab
              key="all"
              title="전시회"
              className="w-full justify-center items-center"
            >
              <ExhibitionCards
                exhibitions={exhibitions}
                user={user}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                isBookmarked={isBookmarked}
              />
              {hasMore ? (
                <div className="flex justify-center items-center my-4">
                  <FaPlusCircle
                    className="text-red-500 text-2xl font-bold hover:cursor-pointer mb-4"
                    onClick={loadMore}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center my-4">
                  <p className="text-gray-500 mb-4">
                    모든 전시회를 불러왔습니다
                  </p>
                </div>
              )}
            </Tab>
            <Tab
              key="free"
              title="무료전시"
              className="w-full justify-center items-center"
            >
              <ExhibitionCards
                exhibitions={exhibitions}
                user={user}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                isBookmarked={isBookmarked}
              />
              {hasMore ? (
                <div className="flex justify-center items-center my-4">
                  <FaPlusCircle
                    className="text-red-500 text-2xl font-bold hover:cursor-pointer mb-4"
                    onClick={loadMore}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center my-4">
                  <p className="text-gray-500 mb-4">
                    모든 전시회를 불러왔습니다
                  </p>
                </div>
              )}
            </Tab>
            <Tab
              key="recommended"
              title="추천전시"
              className="w-full justify-center items-center"
            >
              <ExhibitionCards
                exhibitions={exhibitions}
                user={user}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                isBookmarked={isBookmarked}
              />
              {hasMore ? (
                <div className="flex justify-center items-center my-4">
                  <FaPlusCircle
                    className="text-red-500 text-2xl font-bold hover:cursor-pointer mb-4"
                    onClick={loadMore}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center my-4">
                  <p className="text-gray-500 mb-4">
                    모든 전시회를 불러왔습니다
                  </p>
                </div>
              )}
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
}

// 메인 컴포넌트는 Suspense로 감싸진 컨텐츠를 렌더링
export default function ExhibitionList() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen">
          <Spinner variant="wave" size="lg" color="danger" />
        </div>
      }
    >
      <ExhibitionListContent />
    </Suspense>
  );
}
