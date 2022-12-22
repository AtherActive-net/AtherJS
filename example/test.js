const ather = new AtherJS({
    bodyOverwrite: 'div.body'
});

setTimeout(() => {
    ather.state.setState('user', {
        name: 'John Doe',
        id: 1
    })
},3000)


function increment() {
    ather.state.setState('counter', parseInt(ather.state.getState('counter')) + 1);
}

function modifyUser() {
    ather.state.setState('user', {
        name: 'John Doe 2',
        id: 2
    })
}