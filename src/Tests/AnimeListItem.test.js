import { MockedProvider } from '@apollo/client/testing';
import * as data from './Result.json';
// The component AND the query need to be exported
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import AnimeListItem, { GET_ONE_ANIME } from '../Components/AnimeListItem';
import { act } from "react-dom/test-utils";

const mocks = [
  {
    request: {
      query: GET_ONE_ANIME,
      variables: {
        id: 117802,
      },
    },
    result: data
  },
];

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);});
afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without error', () => {
  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <AnimeListItem id={117802} />
    </MockedProvider>,
    container
  );

});

it('shows the title', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <AnimeListItem id={117802} />
    </MockedProvider>,
  container
  );
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0)); // wait for response
  })
  expect(container.textContent).toContain('Title: ONE PIECE');

});