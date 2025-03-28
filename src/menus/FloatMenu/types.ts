import type { Level } from '@tiptap/extension-heading';
import type { VideoProps } from '../../components/MediaType/Video';
import type { FileProps } from '../../components/MediaType/File';
import type { ImageProps } from '../../components/MediaType/Image';

export interface FloatMenuConfig {
  heading?: Level[];
  image: ImageProps;
  video: VideoProps;
  file: FileProps;
}
