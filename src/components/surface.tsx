import { h, Component } from 'preact';
import { css } from 'glamor';
// @ts-ignore
import { tachyons as tac } from 'glamor-tachyons';

// User options
export interface SurfaceOpts {
  name: string;
  tab: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

// Internal Props
interface SurfaceProps extends SurfaceOpts {
  visible: boolean;
  registerSurface: (name: string, tab: string, surface: Surface) => void;
}

export class Surface extends Component<SurfaceProps> {

  static defaultProps: Partial<SurfaceProps> = {
    maxWidth: '580px',
    maxHeight: '580px',
  };

  container: HTMLElement;
  label: HTMLElement;
  drawArea: HTMLElement;

  componentDidMount() {
    const { name, tab } = this.props;
    this.props.registerSurface(name, tab, this);
  }

  componentDidUpdate() {
    // Prevent re-rendering of this component as it
    // is primarily controlled outside of this class
    return false;
  }

  render() {

    const { height, width, maxHeight, maxWidth, name, visible } = this.props;

    const surfaceStyle = css({
      display: visible ? 'block' : 'none',
      backgroundColor: 'white',
      marginTop: '10px',
      marginBottom: '10px',
      boxShadow: '0 0 6px -3px #777',
      padding: '10px !important',
      height,
      width,
      maxHeight,
      maxWidth,
      overflow: 'auto',
    });

    const labelStyle = css({
      backgroundColor: 'white',
      boxSizing: 'border-box',
      borderBottom: '1px solid #357EDD',
      lineHeight: '2em',
      marginBottom: '20px',
      ...tac('fw6 tc')
    });

    const drawAreaStyle = css({
      boxSizing: 'border-box',

    });

    return (
      <div
        className={`${surfaceStyle} tf-surface`}
        ref={(r) => this.container = r!}
        data-visible={visible}
      >
        <div className={`${labelStyle} tf-label`} ref={(r) => this.label = r!}>
          {name}
        </div>

        <div
          className={`${drawAreaStyle} tf-draw-area`}
          ref={(r) => this.drawArea = r!}
        />
      </div>
    );
  }
}
