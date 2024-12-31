type TaskProps = {
  text: string;
};

export default function Task({ text }: TaskProps) {
  return <li>{text}</li>;
}
