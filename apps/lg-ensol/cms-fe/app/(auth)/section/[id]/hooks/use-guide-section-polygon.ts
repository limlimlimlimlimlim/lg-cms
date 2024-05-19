import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { SectionContext } from '../section-context';
import { createSectionPoint, flatPath } from '../../../../../util/section';
import { addNewSection } from '../../../../../store/slice/add-section-slice';

declare const Konva: any;

const useGuideSectionPolygon = () => {
  const { stage } = useContext<any>(SectionContext);
  const guidePoints = useRef<any[]>([]);
  const guideCircles = useRef<any[]>([]);
  const dispatch = useDispatch();

  const guidelayer = useMemo(() => {
    const layer = new Konva.Layer();
    layer.setAttr('id', 'selectionLayer');
    return layer;
  }, []);

  const guideLine = useMemo(() => {
    return new Konva.Line({
      points: [],
      fill: '',
      stroke: '#FF2233',
      strokeWidth: 1,
      closed: true,
    });
  }, []);

  const removeGuidePolygons = useCallback(() => {
    guideLine.points([]);

    guideCircles.current.forEach((c) => {
      c.remove();
    });
    guideCircles.current = [];
  }, [guideLine]);

  const end = useCallback(() => {
    guidePoints.current.pop();
    dispatch(addNewSection({ path: guidePoints.current }));
    guidePoints.current = [];

    removeGuidePolygons();
  }, [dispatch, removeGuidePolygons]);

  const updateGuide = useCallback(() => {
    guideLine.points(flatPath(guidePoints.current));
    const num = guidePoints.current.length - guideCircles.current.length - 1;
    for (let i = 0; i < num; i += 1) {
      const c = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 6,
        fill: guideCircles.current.length === 0 ? 'red' : 'yellow',
        stroke: 'black',
      });
      guidelayer.add(c);
      guideCircles.current.push(c);

      c.on('mousedown', (e) => {
        e.cancelBubble = true;
        if (e.target === firstCircle()) {
          end();
        }
      });
    }
    guideCircles.current.forEach((p, index) => {
      const { x, y } = guidePoints.current[index];
      p.x(x);
      p.y(y);
    });
  }, [end, guideLine, guidelayer]);

  const startPoint = (x, y) => {
    const p = createSectionPoint(x, y);
    const guidePoint = createSectionPoint(x, y);
    guidePoints.current.push(p, guidePoint);
  };

  const addPoint = (x, y) => {
    guidePoints.current.push(createSectionPoint(x, y));
  };

  const removePoint = (index) => {
    guidePoints.current.splice(index, 1);
  };

  const updatePoint = (index, x, y) => {
    guidePoints.current[index] = createSectionPoint(x, y);
  };

  const firstCircle = () => {
    return guideCircles.current[0];
  };

  const lastPointCoord = () => {
    return guidePoints.current[guidePoints.current.length - 1];
  };

  const onMouseDown = useCallback(
    (e) => {
      if (!stage) return;
      if (e.evt.altKey) return;
      const { x, y } = stage.getRelativePointerPosition();
      const lastCoord = lastPointCoord();

      if (lastCoord) {
        updatePoint(guidePoints.current.length - 1, lastCoord.x, lastCoord.y);
        addPoint(lastCoord.x, lastCoord.y);
      } else {
        startPoint(x, y);
      }
      updateGuide();
    },
    [stage, updateGuide],
  );

  const onMouseMove = useCallback(
    (e) => {
      const { shiftKey } = e.evt;
      const { x: relX, y: relY } = stage.getRelativePointerPosition();
      const lastCoord = lastPointCoord();
      if (!lastCoord) return;
      let newX = 0;
      let newY = 0;
      if (guidePoints.current.length === 0) return;
      if (shiftKey) {
        const { x, y } = guidePoints.current[guidePoints.current.length - 2];
        const radian = Math.round(Math.atan2(relY - y, relX - x) * 10) / 10;

        const degree = (radian * 180) / Math.PI;
        const roundDgreeToNearest10 = roundToNearest(degree, 30);
        const roundRadianToNearest10 = (roundDgreeToNearest10 * Math.PI) / 180;
        const radius = Math.sqrt(Math.pow(relY - y, 2) + Math.pow(relX - x, 2));
        newX = x + radius * Math.cos(roundRadianToNearest10);
        newY = y + radius * Math.sin(roundRadianToNearest10);
      } else {
        newX = relX;
        newY = relY;
      }
      updatePoint(guidePoints.current.length - 1, newX, newY);
      updateGuide();
    },
    [stage, updateGuide],
  );

  const initLayers = useCallback(() => {
    if (!stage) return;
    stage.add(guidelayer);
  }, [guidelayer, stage]);

  const initEvents = useCallback(() => {
    if (!stage) return;
    stage.on('mousedown', onMouseDown);
    stage.on('mousemove', onMouseMove);
  }, [onMouseDown, onMouseMove, stage]);

  const init = useCallback(() => {
    stage.add(guidelayer);
    guidelayer.add(guideLine);
  }, [guideLine, guidelayer, stage]);

  const roundToNearest = (value: number, nearest = 10) => {
    const remainder = value % nearest;
    if (remainder < nearest / 2) {
      return value - remainder;
    }
    return value + (nearest - remainder);
  };

  useEffect(() => {
    if (!stage) return;
    init();
    initLayers();
    initEvents();
    return () => {
      guidelayer.remove();
      stage.off('mousedown', onMouseDown);
      stage.off('mousemove', onMouseMove);
      removeGuidePolygons();
      guideLine.remove();
      guidePoints.current = [];
    };
  }, [
    guideLine,
    init,
    initEvents,
    guidelayer,
    removeGuidePolygons,
    stage,
    initLayers,
    onMouseDown,
    onMouseMove,
  ]);
};

export default useGuideSectionPolygon;