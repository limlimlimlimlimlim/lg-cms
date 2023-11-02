'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useBuildingContext } from '@/app/context/building';

export default function FacilityPage({ params }: any) {
  const { wing, facility, setFacility }: any = useBuildingContext();
  const [isShowDetail, setIsShowDetail] = useState(true);
  const [isShowMiniMap, setIsShowMiniMap] = useState(false);
  const [isShowLegend, setIsShowLegend] = useState(false);
  const mapAreaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const miniImageRef = useRef<HTMLDivElement>(null);

  const setCurrentFacility = useCallback(
    (facilityId: string) => {
      if (!wing) return;

      const currentFacility: any = wing.facility.find((fac: any) => {
        return fac.id.toString() === facilityId;
      });
      setFacility(currentFacility);
    },
    [setFacility, wing],
  );

  useEffect(() => {
    setCurrentFacility(params.facility);
  }, [params.facility, setCurrentFacility, wing]);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({ origin: [ox, oy], first, offset: [s], memo }) => {
        console.log(
          'map area',
          mapAreaRef.current?.getBoundingClientRect(),
          'viewer',
          viewerRef.current?.getBoundingClientRect(),
        );
        if (first) {
          const { width, height, x, y } =
            viewerRef.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          // eslint-disable-next-line no-param-reassign
          memo = [style.x.get(), style.y.get(), tx, ty];
        }
        api.start({ scale: s, rotateZ: 0 });
        return memo;
      },
    },
    {
      target: viewerRef,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 1, max: 2.5 }, rubberband: true },
    },
  );

  useEffect(() => {
    if (!mapAreaRef.current || !viewerRef.current) return;

    // console.log(
    //   'map area',
    //   mapAreaRef.current.getBoundingClientRect(),
    //   'viewer',
    //   viewerRef.current.getBoundingClientRect(),
    // );
  }, [facility]);

  useEffect(() => {
    if (!isShowMiniMap) return;
    if (!rectRef.current) return;
    console.log(
      miniImageRef.current?.clientWidth,
      miniImageRef.current?.clientHeight,
    );
    // rectRef.current.style.width = `${miniImageRef.current?.clientWidth}px`;
    // rectRef.current.style.height = `${miniImageRef.current?.clientHeight}px`;
  }, [isShowMiniMap, miniImageRef]);

  return (
    <div className="tab-wrap">
      {facility ? (
        <>
          <div className="map-box detail">
            <div
              className="map-area"
              ref={mapAreaRef}
              onClick={() => {
                setIsShowDetail(true);
              }}
            >
              <animated.div
                ref={viewerRef as any}
                style={{ ...style, touchAction: 'none', paddingTop: 90 }}
              >
                <img
                  src={wing.image}
                  alt="지도"
                  style={{ position: 'absolute' }}
                />
                <img
                  src={facility.section}
                  alt="지도"
                  style={{ position: 'absolute' }}
                />
                <button
                  type="button"
                  className="btn-location ic_location_c"
                  style={{ top: facility.y, left: facility.x }}
                />
              </animated.div>
            </div>

            <div className={`aside miniMap ${isShowMiniMap ? 'on' : null}`}>
              <button
                type="button"
                className="btn-aside"
                onClick={() => {
                  setIsShowMiniMap(true);
                }}
              >
                미니맵
              </button>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setIsShowMiniMap(false);
                }}
              />
              <img ref={miniImageRef as any} src={wing?.image} alt="" />
              {/* <div
                ref={rectRef}
                style={{
                  position: 'absolute',
                  border: '1px solid red',
                  display: isShowMiniMap ? 'block' : 'none',
                }}
              ></div> */}
            </div>
            <div className={`aside legend ${isShowLegend ? 'on' : null}`}>
              <button
                type="button"
                className="btn-aside"
                onClick={() => {
                  setIsShowLegend(true);
                }}
              >
                범 례
              </button>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setIsShowLegend(false);
                }}
              />
              <ul>
                <li>
                  <img src="/images/ic_legend-f.png" alt="" />
                  여자화장실
                </li>
                <li>
                  <img src="/images/ic_legend-m.png" alt="" />
                  남자화장실
                </li>
                <li>
                  <img src="/images/ic_legend-stair.png" alt="" />
                  계단
                </li>
                <li>
                  <img src="/images/ic_legend-ev.png" alt="" />
                  엘리베이터
                </li>
              </ul>
            </div>
          </div>
          <div
            className="aside-infowrap"
            style={{ display: isShowDetail ? 'block' : 'none' }}
          >
            <h3>{facility.name}</h3>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setIsShowDetail(false);
              }}
            />
            <div className="cont">
              <div className="profile-box">
                <img
                  src={
                    facility.image
                      ? facility.image
                      : '/images/ic_character_gray.svg'
                  }
                  alt=""
                />
              </div>
              <div className="text-box">
                <ul>
                  <li>
                    <a href="tel:02-0000-0000">
                      <i className="ic_phone" />
                      <p>{facility.phone}</p>
                    </a>
                  </li>
                  <li>
                    <i className="ic_location" />
                    <p>{facility.address}</p>
                  </li>
                  <li>
                    <i className="ic_note" />
                    <p>
                      {facility.description}
                      <br />
                      운영시간 : {facility.openingHours}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
