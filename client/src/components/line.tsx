export default function Line(props: any) {
    return (
        <div style={
            {
                width: props.width,
                height: props.height
            }
        }
        class='line'>
        </div>
    );
}