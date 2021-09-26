import React from "react"
import Svg, { Path,  SvgProps} from "react-native-svg"

const Delete:  React.FC<SvgProps> = (props: SvgProps) => {
  return (
    <Svg height="24" width="2" {...props}>
      <Path d="M0 0h24v24H0V0z" fill={props.color} />
      <Path  fill={props.color} d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
    </Svg>
  )
}

export default Delete