'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dummyData from '../../data/data';

export default function Main() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isShowPopup, setIsShowPopup] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  useEffect(() => {
    setData(dummyData.tree as any);
  }, []);

  const createItems = useCallback(() => {
    return data
      .concat()
      .reverse()
      .map((item: any, i) => {
        return (
          <li key={i}>
            <Link href={`/building/${item.id}/${item.wing[0].id}`}>
              <p>
                {item.floorName}
                <i className="ic_arrow_right" />
              </p>
            </Link>
          </li>
        );
      });
  }, [data]);

  const onClickSearch = useCallback(() => {
    router.push('/search');
  }, [router]);

  const onClickShowPopup = useCallback(() => {
    setIsShowPopup(true);
  }, []);

  const onClickHidePopup = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  return (
    <>
      <header className="header">
        <div>
          <button className="btn-back" />
          <h2>빌딩안내</h2>
          <button className="btn-home" />
          <button className="btn-menu" />
        </div>
      </header>

      <section className="form-search">
        <input
          type="button"
          className="ip-srchForm"
          value="초성만 입력해도 검색이 가능합니다."
          onClick={onClickSearch}
        />
      </section>

      <section className="content">
        <div className="list-floor">
          <ul>{createItems()}</ul>
        </div>

        <button
          className="btn-popup twinIntro"
          data-target=".pop-twinIntro"
          onClick={onClickShowPopup}
        >
          LG 트윈타워 소개
        </button>

        <div className="info-box">
          <div>
            <span className="ic_barrier" />
          </div>
          <div className="text-box">
            <b>장애인 화장실 위치 안내</b>
            <p>동관 지하 1층, 서관 지하 1층에 위치해 있습니다.</p>
          </div>
        </div>
      </section>

      {/* <!-- popup 트윈타워 소개 --> */}
      <section
        className={`popup-wrap pop-twinIntro ${isShowPopup ? 'on' : ''}`}
      >
        <div className="popup-layer">
          <h3>LG 트윈타워 소개</h3>
          {/* <!-- <button className="btn-close"></button> --> */}
          <div className="pop-cont">
            <div>
              <img src="/images/img-popupContent.jpg" alt="" />
            </div>
          </div>
          <button className="btn-ok" onClick={onClickHidePopup}>
            확인
          </button>
        </div>
      </section>
    </>
  );
}
