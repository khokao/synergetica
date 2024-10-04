import type { FC } from 'react'
import {
  useReactFlow,
  useViewport,
} from '@xyflow/react'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


export const ZoomInOut: FC = () => {
  const { zoomIn, zoomOut } = useReactFlow()
  const { zoom } = useViewport()

  return (
    <div className="flex bg-gray-100 rounded-xl shadow-lg border-[1.0px] border-gray-300">
      <div
        className='flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-black/5'
        onClick={(e) => {
          e.stopPropagation()
          zoomOut()
        }}
      >
        <ZoomInIcon className='w-6 h-6 text-gray-500' />
      </div>

    <div className='flex items-center justify-center text-gray-500 w-[34px]'>{parseFloat(`${zoom * 100}`).toFixed(0)}%</div>
      <div
        className='flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-black/5'
        onClick={(e) => {
          e.stopPropagation()
          zoomIn()
        }}
      >
        <ZoomOutIcon className='w-6 h-6 text-gray-500' />
      </div>
    </div>
  )
}
