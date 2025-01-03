import { cn, connectionIdToColor } from "@/lib/utils";
import React, { memo } from "react";

export const Cursor = memo(
  ({
    x,
    y,
    name,
    connectionId,
  }: {
    x: number;
    y: number;
    name: string;
    connectionId: number;
  }) => {
    return (
      <>
        <foreignObject
          className="relative"
          style={{
            transform: `translateX(${x}px) translateY(${y}px)`,
          }}
          width={150}
          height={150}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 39.17951 52.6305"
          >
            <path
              d="M5.81698,49.84913c-.27219-15.80887-.54437-31.61774-.81656-47.42661L.73265,4.19029c11.37835,9.87939,22.7567,19.75878,34.13505,29.63817l2.43237-4.17846c-4.01854-1.04051-8.04056-2.06749-12.06641-3.07933-3.5477-.89167-7.78717-2.40355-10.54124,.95595-1.17991,1.43929-1.97981,3.20302-2.88401,4.81962-1.05456,1.88542-2.10912,3.77084-3.16367,5.65625-2.028,3.6258-4.05599,7.25161-6.08399,10.87741-1.57245,2.81135,2.74472,5.33527,4.31735,2.5236,3.65011-6.52594,7.25707-13.07824,10.95118-19.57934,.56776-.99917,.8028-1.57267,2.02391-1.41335,1.68254,.21953,3.37446,.81042,5.0174,1.22437,3.70324,.93305,7.40322,1.87896,11.10028,2.83622,2.29146,.59332,4.39239-2.47665,2.43237-4.17846C27.02489,20.41353,15.64654,10.53414,4.26819,.65476,2.70198-.70513-.03897,.13441,.00042,2.42252c.27219,15.80887,.54437,31.61774,.81656,47.42661,.05533,3.21392,5.05551,3.22403,5,0h0Z"
              fill={connectionIdToColor(connectionId)}
            />
          </svg>
          {/* <MousePointer
            className="w-5 h-5"
            fill={getMemberPointerColor(index)}
            style={{
              color: getMemberPointerColor(index),
            }}
          /> */}
          <div
            className={cn(
              "absolute top-4 left-4 rounded-md p-1 text-xs text-white"
            )}
            style={{
              backgroundColor: connectionIdToColor(connectionId),
            }}
          >
            {name}
          </div>
        </foreignObject>
      </>
    );
  }
);

Cursor.displayName = "Cursor";
