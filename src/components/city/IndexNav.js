import React, { Component } from 'react';

class IndexNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navOffsetX: 0
        };
    }

    onTouchStart = e => {
        if (e.target.tagName !== 'LI') {
            return;
        }

        const navOffsetX = e.changedTouches[0].clientX;
        const y = e.changedTouches[0].clientY;
        this.setState({ navOffsetX }, () => {
            this.props.onNavChange({ moving: true });
            this.scrollList(y);
            window.addEventListener('touchmove', this.onTouchMove, { passive: false });
            window.addEventListener('touchend', this.onTouchEnd);
        });
    }

    onTouchMove = e => {
        if ( e.cancelable ) {
            e.preventDefault();
        }
        this.scrollList(e.changedTouches[0].clientY);
    }

    onTouchEnd = () => {
        setTimeout(() => {
            this.props.onNavChange({ moving: false, label: '' });
            window.removeEventListener('touchmove', this.onTouchMove);
            window.removeEventListener('touchend', this.onTouchEnd);
        }, 500);
    }

    scrollList = y => {
        const { navOffsetX } = this.state;
        const currentItem = document.elementFromPoint(navOffsetX, y);
        const label = currentItem.textContent;

        if (!currentItem || !currentItem.classList.contains('city-label-item')) {
            return;
        }

        this.props.onNavChange({ label });
    }

    render() {
        const labels = this.props.labels;

        return (
            <ul className="city-label-wrapper" onTouchStart={ this.onTouchStart }>
                {
                    labels.map(label => {
                        return <li key={ label } className="city-label-item">{ label }</li>;
                    })
                }
            </ul>
        );

    }
}

export default IndexNav;