import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Button = styled(Link)`
    border-radius: 50px;
    background: ${({ primary }) => (primary ? '#ffA500' : '#010606')}; // Orange for primary, black otherwise
    white-space: nowrap;
    padding: ${({ big }) => (big ? '14px 48px' : '12px 30px')};
    color: ${({ dark }) => (dark ? '#010606' : '#fff')}; // Black text for light backgrounds, white for dark backgrounds
    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: ${({ primary, dark }) =>
            primary
                ? dark
                    ? '#fff' 
                    : '#ffA500' 
                : '#ffA500'}; 
        color: ${({ primary, dark }) =>
            primary
                ? dark
                    ? '#010606'
                    : '#fff'
                : '#fff'};
    }
`;
