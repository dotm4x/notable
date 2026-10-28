import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './pagination.js';

function ControlledPagination({
  page: initialPage,
  ...props
}: Omit<ComponentProps<typeof Pagination>, 'onPageChange'>) {
  const [page, setPage] = useState(initialPage);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
}

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    page: 1,
    pageCount: 12,
    siblingCount: 1,
    showFirstLast: false,
    disabled: false,
    size: 'medium',
  },
  argTypes: {
    page: {
      control: { type: 'number', min: 1 },
    },
    pageCount: {
      control: { type: 'number', min: 0 },
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
    },
    showFirstLast: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
  render: (args) => <ControlledPagination {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewPages: Story = {
  args: {
    pageCount: 4,
  },
};

export const ManyPages: Story = {
  args: {
    page: 10,
    pageCount: 42,
  },
};

export const FirstAndLastControls: Story = {
  args: {
    page: 6,
    pageCount: 20,
    showFirstLast: true,
  },
};

export const Small: Story = {
  args: {
    page: 6,
    pageCount: 20,
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    page: 6,
    pageCount: 20,
    showFirstLast: true,
    disabled: true,
  },
};

function ComposedPagination() {
  const [page, setPage] = useState(3);
  return (
    <Pagination page={page} pageCount={9} onPageChange={setPage}>
      <Pagination.Previous>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next>Next</Pagination.Next>
    </Pagination>
  );
}

export const Composed: Story = {
  render: () => <ComposedPagination />,
};

const LIST_PAGE_SIZE = 5;

function ListFooterExample() {
  const [page, setPage] = useState(1);
  const items = Array.from({ length: LIST_PAGE_SIZE }, (_, index) => {
    return `Result ${(page - 1) * LIST_PAGE_SIZE + index + 1}`;
  });
  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '28rem' }}>
      <ul style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Pagination
        page={page}
        pageCount={8}
        onPageChange={setPage}
        showFirstLast
      />
    </div>
  );
}

export const InListFooter: Story = {
  render: () => <ListFooterExample />,
};
